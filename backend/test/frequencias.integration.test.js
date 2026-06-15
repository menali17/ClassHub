const assert = require("node:assert/strict");
const { randomUUID } = require("node:crypto");
const { existsSync, unlinkSync } = require("node:fs");
const { tmpdir } = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");
const test = require("node:test");

const backendRoot = path.resolve(__dirname, "..");

async function request(baseUrl, route, { method = "GET", token, body } = {}) {
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${baseUrl}${route}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();

  return {
    status: response.status,
    body: text ? JSON.parse(text) : null,
  };
}

async function waitForApi(baseUrl) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/api`);

      if (response.ok) {
        return;
      }
    } catch {}

    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  throw new Error("A API nao iniciou dentro do tempo esperado.");
}

function removeDatabaseFiles(databasePath) {
  [databasePath, `${databasePath}-shm`, `${databasePath}-wal`].forEach((filePath) => {
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
  });
}

test("fluxo de aulas e frequencias respeita regras e perfis", async () => {
  const port = 3400 + Math.floor(Math.random() * 400);
  const baseUrl = `http://127.0.0.1:${port}`;
  const databasePath = path.join(tmpdir(), `engnet-${randomUUID()}.sqlite`);
  const api = spawn(process.execPath, ["src/main.js"], {
    cwd: backendRoot,
    env: {
      ...process.env,
      PORT: String(port),
      DATABASE_PATH: databasePath,
    },
    stdio: "ignore",
  });

  try {
    await waitForApi(baseUrl);

    const teacherLogin = await request(baseUrl, "/api/auth/login", {
      method: "POST",
      body: { email: "professor01@engnet.com", senha: "123456" },
    });
    const studentLogin = await request(baseUrl, "/api/auth/login", {
      method: "POST",
      body: { email: "aluno01@engnet.com", senha: "123456" },
    });
    const adminLogin = await request(baseUrl, "/api/auth/login", {
      method: "POST",
      body: { email: "admin@engnet.com", senha: "123456" },
    });
    const teacherToken = teacherLogin.body.token;
    const studentToken = studentLogin.body.token;
    const adminToken = adminLogin.body.token;
    const classStudents = await request(baseUrl, "/api/turmas/1/alunos", {
      token: teacherToken,
    });
    const students = classStudents.body.alunos;

    assert.equal(teacherLogin.status, 200);
    assert.equal(studentLogin.status, 200);
    assert.equal(adminLogin.status, 200);
    assert.equal(students.length, 7);

    let lastLesson;
    let lastAttendance;

    for (let day = 10; day <= 13; day += 1) {
      const lesson = await request(baseUrl, "/api/turmas/1/aulas", {
        method: "POST",
        token: teacherToken,
        body: { data: `2026-06-${day}`, horario: "19:00" },
      });
      const attendance = students.map((student) => ({
        alunoId: student.id,
        situacao: day === 13 && student.id === students[0].id ? "falta" : "presente",
      }));
      const saved = await request(baseUrl, `/api/aulas/${lesson.body.id}/frequencias`, {
        method: "PUT",
        token: teacherToken,
        body: { frequencias: attendance },
      });

      assert.equal(lesson.status, 201);
      assert.equal(lesson.body.data, `2026-06-${day}`);
      assert.equal(saved.status, 200);
      assert.equal(saved.body.resumo.totalAlunos, students.length);
      lastLesson = lesson.body;
      lastAttendance = attendance;
    }

    const resent = await request(baseUrl, `/api/aulas/${lastLesson.id}/frequencias`, {
      method: "PUT",
      token: teacherToken,
      body: { frequencias: lastAttendance },
    });
    assert.equal(resent.status, 200);
    assert.equal(resent.body.frequencias.length, students.length);

    const lessons = await request(baseUrl, "/api/turmas/1/aulas", {
      token: teacherToken,
    });
    assert.equal(lessons.status, 200);
    assert.deepEqual(
      lessons.body.aulas.slice(0, 4).map((lesson) => lesson.data),
      ["2026-06-13", "2026-06-12", "2026-06-11", "2026-06-10"],
    );

    const teacherHistory = await request(
      baseUrl,
      `/api/alunos/${students[0].id}/frequencia`,
      { token: teacherToken },
    );
    const ownHistory = await request(baseUrl, "/api/alunos/me/frequencia", {
      token: studentToken,
    });
    const adminHistory = await request(
      baseUrl,
      `/api/alunos/${students[0].id}/frequencia`,
      { token: adminToken },
    );

    assert.equal(teacherHistory.status, 200);
    assert.equal(teacherHistory.body.limiteBaixaFrequencia, 75);
    assert.equal(teacherHistory.body.resumoGeral.percentualPresenca, 75);
    assert.equal(teacherHistory.body.resumoGeral.baixaFrequencia, false);
    assert.equal(ownHistory.status, 200);
    assert.equal(ownHistory.body.limiteBaixaFrequencia, 75);
    assert.equal(ownHistory.body.aluno.id, students[0].id);
    assert.equal(adminHistory.status, 200);

    const duplicateLesson = await request(baseUrl, "/api/turmas/1/aulas", {
      method: "POST",
      token: teacherToken,
      body: { data: "2026-06-10", horario: "19:00" },
    });
    const adminCreatingLesson = await request(baseUrl, "/api/turmas/1/aulas", {
      method: "POST",
      token: adminToken,
      body: { data: "2026-06-14", horario: "20:00" },
    });
    const studentReadingOther = await request(
      baseUrl,
      `/api/alunos/${students[1].id}/frequencia`,
      { token: studentToken },
    );

    assert.equal(duplicateLesson.status, 409);
    assert.equal(adminCreatingLesson.status, 403);
    assert.equal(studentReadingOther.status, 403);

    const pendingLesson = await request(baseUrl, "/api/turmas/1/aulas", {
      method: "POST",
      token: teacherToken,
      body: { data: "2026-06-14", horario: "20:00" },
    });
    const incompleteAttendance = await request(
      baseUrl,
      `/api/aulas/${pendingLesson.body.id}/frequencias`,
      {
        method: "PUT",
        token: teacherToken,
        body: {
          frequencias: students.slice(0, 4).map((student) => ({
            alunoId: student.id,
            situacao: "presente",
          })),
        },
      },
    );
    const duplicateStudentRecords = students.map((student) => ({
      alunoId: student.id,
      situacao: "presente",
    }));
    duplicateStudentRecords[1].alunoId = duplicateStudentRecords[0].alunoId;
    const duplicatedAttendance = await request(
      baseUrl,
      `/api/aulas/${pendingLesson.body.id}/frequencias`,
      {
        method: "PUT",
        token: teacherToken,
        body: { frequencias: duplicateStudentRecords },
      },
    );

    assert.equal(incompleteAttendance.status, 400);
    assert.equal(duplicatedAttendance.status, 409);
  } finally {
    api.kill();
    await new Promise((resolve) => setTimeout(resolve, 300));
    removeDatabaseFiles(databasePath);
  }
});
