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

async function download(baseUrl, route, token) {
  const response = await fetch(`${baseUrl}${route}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return {
    status: response.status,
    contentType: response.headers.get("content-type"),
    disposition: response.headers.get("content-disposition"),
    buffer: Buffer.from(await response.arrayBuffer()),
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

test("dashboard e relatorios calculam frequencia e respeitam perfis", async () => {
  const port = 3800 + Math.floor(Math.random() * 100);
  const baseUrl = `http://127.0.0.1:${port}`;
  const databasePath = path.join(tmpdir(), `engnet-relatorios-${randomUUID()}.sqlite`);
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
      body: { email: "professor@engnet.com", senha: "123456" },
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

    for (let lessonIndex = 0; lessonIndex < 4; lessonIndex += 1) {
      const day = String(10 + lessonIndex).padStart(2, "0");
      const lesson = await request(baseUrl, "/api/turmas/1/aulas", {
        method: "POST",
        token: teacherToken,
        body: { data: `2026-06-${day}`, horario: "19:00" },
      });
      const attendance = students.map((student, studentIndex) => {
        let status = "presente";

        if (studentIndex === 0 && lessonIndex >= 2) {
          status = "falta";
        }

        if (studentIndex === 1 && lessonIndex === 3) {
          status = "falta";
        }

        return { alunoId: student.id, situacao: status };
      });
      const saved = await request(baseUrl, `/api/aulas/${lesson.body.id}/frequencias`, {
        method: "PUT",
        token: teacherToken,
        body: { frequencias: attendance },
      });

      assert.equal(lesson.status, 201);
      assert.equal(saved.status, 200);
    }

    const teacherDashboard = await request(baseUrl, "/api/dashboard", {
      token: teacherToken,
    });
    const adminDashboard = await request(baseUrl, "/api/dashboard", {
      token: adminToken,
    });
    const studentDashboard = await request(baseUrl, "/api/dashboard", {
      token: studentToken,
    });

    assert.equal(teacherDashboard.status, 200);
    assert.equal(teacherDashboard.body.totalAlunos, 10);
    assert.equal(teacherDashboard.body.totalAulas, 4);
    assert.equal(teacherDashboard.body.taxaMediaPresenca, 85);
    assert.equal(teacherDashboard.body.alunosComBaixaFrequencia.length, 1);
    assert.equal(
      teacherDashboard.body.alunosComBaixaFrequencia[0].id,
      students[0].id,
    );
    assert.equal(adminDashboard.status, 200);
    assert.equal(adminDashboard.body.totalAlunos, 10);
    assert.equal(studentDashboard.status, 403);

    const lowAttendance = await request(
      baseUrl,
      "/api/relatorios/alunos-baixa-frequencia?turmaId=1",
      { token: teacherToken },
    );
    assert.equal(lowAttendance.status, 200);
    assert.equal(lowAttendance.body.totalAlunos, 1);
    assert.equal(lowAttendance.body.alunos[0].percentualPresenca, 50);
    assert.equal(
      lowAttendance.body.alunos.some((student) => student.percentualPresenca === 75),
      false,
    );

    const individualReport = await request(
      baseUrl,
      `/api/relatorios/alunos/${students[0].id}`,
      { token: teacherToken },
    );
    assert.equal(individualReport.status, 200);
    assert.equal(individualReport.body.resumoGeral.percentualPresenca, 50);
    assert.equal(individualReport.body.resumoGeral.baixaFrequencia, true);
    assert.equal(typeof individualReport.body.geradoEm, "string");

    const classReport = await request(baseUrl, "/api/relatorios/turmas/1", {
      token: adminToken,
    });
    assert.equal(classReport.status, 200);
    assert.equal(classReport.body.resumo.totalAlunos, 5);
    assert.equal(classReport.body.resumo.totalAulas, 4);
    assert.equal(classReport.body.resumo.percentualPresenca, 85);
    assert.equal(classReport.body.aulas.length, 4);
    assert.equal(classReport.body.aulas[0].frequencias.length, 5);

    const classPdf = await download(
      baseUrl,
      "/api/relatorios/turmas/1/exportar?formato=pdf",
      adminToken,
    );
    assert.equal(classPdf.status, 200);
    assert.match(classPdf.contentType, /^application\/pdf/);
    assert.match(classPdf.disposition, /turma-lab-sw-01\.pdf/);
    assert.equal(classPdf.buffer.subarray(0, 4).toString(), "%PDF");

    const lowAttendanceSpreadsheet = await download(
      baseUrl,
      "/api/relatorios/alunos-baixa-frequencia/exportar?turmaId=1&formato=xlsx",
      teacherToken,
    );
    assert.equal(lowAttendanceSpreadsheet.status, 200);
    assert.match(
      lowAttendanceSpreadsheet.contentType,
      /^application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet/,
    );
    assert.match(
      lowAttendanceSpreadsheet.disposition,
      /baixa-frequencia-lab-sw-01\.xlsx/,
    );
    assert.equal(lowAttendanceSpreadsheet.buffer.subarray(0, 2).toString(), "PK");

    const invalidExport = await request(
      baseUrl,
      `/api/relatorios/alunos/${students[0].id}/exportar?formato=csv`,
      { token: teacherToken },
    );
    assert.equal(invalidExport.status, 400);

    const studentReport = await request(baseUrl, "/api/relatorios/turmas/1", {
      token: studentToken,
    });
    assert.equal(studentReport.status, 403);
  } finally {
    api.kill();
    await new Promise((resolve) => setTimeout(resolve, 300));
    removeDatabaseFiles(databasePath);
  }
});
