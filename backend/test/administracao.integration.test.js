const assert = require("node:assert/strict");
const { randomUUID } = require("node:crypto");
const { existsSync, unlinkSync } = require("node:fs");
const { tmpdir } = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");
const { DatabaseSync } = require("node:sqlite");
const test = require("node:test");
const { DatabaseService } = require("../src/database/database.service");

const backendRoot = path.resolve(__dirname, "..");

async function request(baseUrl, route, { method = "GET", token, body } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const response = await fetch(`${baseUrl}${route}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  return { status: response.status, body: text ? JSON.parse(text) : null };
}

async function waitForApi(baseUrl) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/api`);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error("A API nao iniciou dentro do tempo esperado.");
}

function removeDatabaseFiles(databasePath) {
  [databasePath, `${databasePath}-shm`, `${databasePath}-wal`].forEach((filePath) => {
    if (existsSync(filePath)) unlinkSync(filePath);
  });
}

test("banco existente recebe as colunas administrativas sem perder usuarios", () => {
  const databasePath = path.join(tmpdir(), `engnet-migration-${randomUUID()}.sqlite`);
  const legacyDatabase = new DatabaseSync(databasePath);
  legacyDatabase.exec(`
    CREATE TABLE usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      matricula TEXT UNIQUE,
      senha_hash TEXT NOT NULL,
      perfil TEXT NOT NULL,
      foto_url TEXT,
      criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      atualizado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE turmas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      codigo TEXT NOT NULL UNIQUE,
      horario TEXT NOT NULL,
      professor_id INTEGER NOT NULL
    );
    CREATE TABLE turma_alunos (
      turma_id INTEGER NOT NULL,
      aluno_id INTEGER NOT NULL,
      vinculado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (turma_id, aluno_id)
    );
    INSERT INTO usuarios (nome, email, senha_hash, perfil)
    VALUES ('Administrador legado', 'legado@engnet.com', 'hash-legado', 'administrador');
  `);
  legacyDatabase.close();

  const previousDatabasePath = process.env.DATABASE_PATH;
  let databaseService;

  try {
    process.env.DATABASE_PATH = databasePath;
    databaseService = new DatabaseService();

    const userColumns = databaseService.database
      .prepare("PRAGMA table_info(usuarios)")
      .all()
      .map((column) => column.name);
    const linkColumns = databaseService.database
      .prepare("PRAGMA table_info(turma_alunos)")
      .all()
      .map((column) => column.name);

    assert.equal(databaseService.getSummary().usuarios, 1);
    assert.deepEqual(
      userColumns.filter((column) => ["telefone", "departamento", "ativo"].includes(column)),
      ["telefone", "departamento", "ativo"],
    );
    assert.deepEqual(
      linkColumns.filter((column) => ["ativo", "desvinculado_em"].includes(column)),
      ["ativo", "desvinculado_em"],
    );
  } finally {
    databaseService?.database.close();

    if (previousDatabasePath === undefined) {
      delete process.env.DATABASE_PATH;
    } else {
      process.env.DATABASE_PATH = previousDatabasePath;
    }

    removeDatabaseFiles(databasePath);
  }
});

test("administrador gerencia usuarios turmas vinculos e o proprio perfil", async () => {
  const port = 3900 + Math.floor(Math.random() * 80);
  const baseUrl = `http://127.0.0.1:${port}`;
  const databasePath = path.join(tmpdir(), `engnet-admin-${randomUUID()}.sqlite`);
  const api = spawn(process.execPath, ["src/main.js"], {
    cwd: backendRoot,
    env: { ...process.env, PORT: String(port), DATABASE_PATH: databasePath },
    stdio: "ignore",
  });

  try {
    await waitForApi(baseUrl);

    const adminLogin = await request(baseUrl, "/api/auth/login", {
      method: "POST",
      body: { email: "admin@engnet.com", senha: "123456" },
    });
    const teacherLogin = await request(baseUrl, "/api/auth/login", {
      method: "POST",
      body: { email: "professor01@engnet.com", senha: "123456" },
    });
    const adminToken = adminLogin.body.token;
    const teacherToken = teacherLogin.body.token;

    const professor = await request(baseUrl, "/api/professores", {
      method: "POST",
      token: adminToken,
      body: {
        nome: "Marina Teste",
        email: "marina.teste@engnet.com",
        senha: "123456",
        departamento: "Engenharia",
        telefone: "(61) 99999-1000",
      },
    });
    assert.equal(professor.status, 201);
    assert.equal(professor.body.perfil, "professor");
    assert.equal(professor.body.departamento, "Engenharia");

    const aluno = await request(baseUrl, "/api/alunos", {
      method: "POST",
      token: adminToken,
      body: {
        nome: "Aluno Teste",
        email: "aluno.teste@engnet.com",
        matricula: "20269999",
        senha: "123456",
      },
    });
    assert.equal(aluno.status, 201);
    assert.equal(aluno.body.matricula, "20269999");

    const forbiddenCreate = await request(baseUrl, "/api/professores", {
      method: "POST",
      token: teacherToken,
      body: { nome: "Sem Permissao", email: "sem@engnet.com", senha: "123456" },
    });
    assert.equal(forbiddenCreate.status, 403);

    const duplicateEmail = await request(baseUrl, "/api/alunos", {
      method: "POST",
      token: adminToken,
      body: {
        nome: "Duplicado",
        email: "aluno.teste@engnet.com",
        matricula: "20269998",
        senha: "123456",
      },
    });
    assert.equal(duplicateEmail.status, 409);

    const updatedProfessor = await request(
      baseUrl,
      `/api/professores/${professor.body.id}`,
      {
        method: "PATCH",
        token: adminToken,
        body: { departamento: "Computacao", telefone: "(61) 99999-2000" },
      },
    );
    assert.equal(updatedProfessor.status, 200);
    assert.equal(updatedProfessor.body.departamento, "Computacao");

    const unsafeDeactivation = await request(
      baseUrl,
      `/api/professores/${professor.body.id}`,
      {
        method: "PATCH",
        token: adminToken,
        body: { ativo: false },
      },
    );
    assert.equal(unsafeDeactivation.status, 400);

    const createdClass = await request(baseUrl, "/api/turmas", {
      method: "POST",
      token: adminToken,
      body: {
        nome: "Turma Administrativa",
        codigo: "ADM-TESTE",
        horario: "Sexta, 18:00",
        professorId: professor.body.id,
      },
    });
    assert.equal(createdClass.status, 201);

    const blockedProfessorRemoval = await request(
      baseUrl,
      `/api/professores/${professor.body.id}`,
      { method: "DELETE", token: adminToken },
    );
    assert.equal(blockedProfessorRemoval.status, 409);

    const linked = await request(baseUrl, `/api/turmas/${createdClass.body.id}/alunos`, {
      method: "POST",
      token: adminToken,
      body: { alunoId: aluno.body.id },
    });
    assert.equal(linked.status, 200);

    const unlinked = await request(
      baseUrl,
      `/api/turmas/${createdClass.body.id}/alunos/${aluno.body.id}`,
      { method: "DELETE", token: adminToken },
    );
    assert.equal(unlinked.status, 200);

    const classStudents = await request(
      baseUrl,
      `/api/turmas/${createdClass.body.id}/alunos`,
      { token: adminToken },
    );
    assert.equal(classStudents.body.quantidadeAlunos, 0);

    const transferClass = await request(baseUrl, `/api/turmas/${createdClass.body.id}`, {
      method: "PATCH",
      token: adminToken,
      body: { professorId: teacherLogin.body.usuario.id },
    });
    assert.equal(transferClass.status, 200);

    const removedProfessor = await request(
      baseUrl,
      `/api/professores/${professor.body.id}`,
      { method: "DELETE", token: adminToken },
    );
    assert.equal(removedProfessor.status, 200);
    assert.equal(removedProfessor.body.usuario.ativo, false);

    const deactivatedLogin = await request(baseUrl, "/api/auth/login", {
      method: "POST",
      body: { email: "marina.teste@engnet.com", senha: "123456" },
    });
    assert.equal(deactivatedLogin.status, 401);

    const relinkedStudent = await request(
      baseUrl,
      `/api/turmas/${createdClass.body.id}/alunos`,
      {
        method: "POST",
        token: adminToken,
        body: { alunoId: aluno.body.id },
      },
    );
    assert.equal(relinkedStudent.status, 200);

    const removedStudent = await request(baseUrl, `/api/alunos/${aluno.body.id}`, {
      method: "DELETE",
      token: adminToken,
    });
    assert.equal(removedStudent.status, 200);
    assert.equal(removedStudent.body.usuario.ativo, false);

    const studentsAfterDeactivation = await request(
      baseUrl,
      `/api/turmas/${createdClass.body.id}/alunos`,
      { token: adminToken },
    );
    assert.equal(studentsAfterDeactivation.body.quantidadeAlunos, 0);

    const teacherDeleteClass = await request(
      baseUrl,
      `/api/turmas/${createdClass.body.id}`,
      { method: "DELETE", token: teacherToken },
    );
    assert.equal(teacherDeleteClass.status, 403);

    const adminDeleteClass = await request(
      baseUrl,
      `/api/turmas/${createdClass.body.id}`,
      { method: "DELETE", token: adminToken },
    );
    assert.equal(adminDeleteClass.status, 200);

    const profile = await request(baseUrl, "/api/perfil", {
      method: "PATCH",
      token: adminToken,
      body: { nome: "Administrador Atualizado", telefone: "(61) 98888-0000" },
    });
    assert.equal(profile.status, 200);
    assert.equal(profile.body.nome, "Administrador Atualizado");

    const passwordChange = await request(baseUrl, "/api/perfil/senha", {
      method: "PATCH",
      token: adminToken,
      body: { senhaAtual: "123456", novaSenha: "654321" },
    });
    assert.equal(passwordChange.status, 200);

    const newLogin = await request(baseUrl, "/api/auth/login", {
      method: "POST",
      body: { email: "admin@engnet.com", senha: "654321" },
    });
    assert.equal(newLogin.status, 200);

    const dashboard = await request(baseUrl, "/api/dashboard", {
      token: newLogin.body.token,
    });
    assert.equal(dashboard.status, 200);
    assert.equal(dashboard.body.totalProfessores, 3);
    assert.equal(dashboard.body.totalTurmas, 4);
    assert.equal(dashboard.body.totalAlunos, 15);
  } finally {
    api.kill();
    await new Promise((resolve) => setTimeout(resolve, 300));
    removeDatabaseFiles(databasePath);
  }
});
