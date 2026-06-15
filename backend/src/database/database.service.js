const { Injectable } = require("@nestjs/common");
const { randomBytes, scryptSync } = require("node:crypto");
const { mkdirSync } = require("node:fs");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

class DatabaseService {
  constructor() {
    const defaultPath = path.join(process.cwd(), "data", "engnet.sqlite");
    this.databasePath = path.resolve(process.env.DATABASE_PATH || defaultPath);
    this.lowAttendanceThreshold = this.parseAttendanceThreshold(
      process.env.LOW_ATTENDANCE_THRESHOLD,
    );

    mkdirSync(path.dirname(this.databasePath), { recursive: true });

    this.database = new DatabaseSync(this.databasePath);
    this.database.exec("PRAGMA foreign_keys = ON;");
    this.database.exec("PRAGMA journal_mode = WAL;");

    this.createSchema();
    this.migrateSchema();
    this.seedDatabase();
  }

  createSchema() {
    this.database.exec(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        matricula TEXT UNIQUE,
        senha_hash TEXT NOT NULL,
        perfil TEXT NOT NULL CHECK (perfil IN ('aluno', 'professor', 'administrador')),
        foto_url TEXT,
        telefone TEXT,
        departamento TEXT,
        ativo INTEGER NOT NULL DEFAULT 1 CHECK (ativo IN (0, 1)),
        criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        atualizado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS turmas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        codigo TEXT NOT NULL UNIQUE,
        horario TEXT NOT NULL,
        professor_id INTEGER NOT NULL,
        criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        atualizado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (professor_id) REFERENCES usuarios(id)
      );

      CREATE TABLE IF NOT EXISTS turma_alunos (
        turma_id INTEGER NOT NULL,
        aluno_id INTEGER NOT NULL,
        ativo INTEGER NOT NULL DEFAULT 1 CHECK (ativo IN (0, 1)),
        vinculado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        desvinculado_em TEXT,
        PRIMARY KEY (turma_id, aluno_id),
        FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE CASCADE,
        FOREIGN KEY (aluno_id) REFERENCES usuarios(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS aulas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        turma_id INTEGER NOT NULL,
        data TEXT NOT NULL,
        horario TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'aberta' CHECK (status IN ('aberta', 'finalizada')),
        criada_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS frequencias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        aula_id INTEGER NOT NULL,
        aluno_id INTEGER NOT NULL,
        situacao TEXT NOT NULL CHECK (situacao IN ('presente', 'falta')),
        registrada_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (aula_id, aluno_id),
        FOREIGN KEY (aula_id) REFERENCES aulas(id) ON DELETE CASCADE,
        FOREIGN KEY (aluno_id) REFERENCES usuarios(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS sessoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        token_hash TEXT NOT NULL UNIQUE,
        expira_em TEXT NOT NULL,
        revogada_em TEXT,
        criada_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_usuarios_perfil ON usuarios(perfil);
      CREATE INDEX IF NOT EXISTS idx_usuarios_matricula ON usuarios(matricula);
      CREATE INDEX IF NOT EXISTS idx_turmas_professor ON turmas(professor_id);
      CREATE INDEX IF NOT EXISTS idx_aulas_turma ON aulas(turma_id);
      CREATE UNIQUE INDEX IF NOT EXISTS idx_aulas_turma_data_horario
        ON aulas(turma_id, data, horario);
      CREATE INDEX IF NOT EXISTS idx_frequencias_aluno ON frequencias(aluno_id);
      CREATE INDEX IF NOT EXISTS idx_sessoes_usuario ON sessoes(usuario_id);
      CREATE INDEX IF NOT EXISTS idx_sessoes_token ON sessoes(token_hash);
    `);
  }

  migrateSchema() {
    this.ensureColumn("usuarios", "telefone", "TEXT");
    this.ensureColumn("usuarios", "departamento", "TEXT");
    this.ensureColumn(
      "usuarios",
      "ativo",
      "INTEGER NOT NULL DEFAULT 1 CHECK (ativo IN (0, 1))",
    );
    this.ensureColumn(
      "turma_alunos",
      "ativo",
      "INTEGER NOT NULL DEFAULT 1 CHECK (ativo IN (0, 1))",
    );
    this.ensureColumn("turma_alunos", "desvinculado_em", "TEXT");
  }

  ensureColumn(table, column, definition) {
    const columns = this.database.prepare(`PRAGMA table_info(${table})`).all();

    if (!columns.some((existingColumn) => existingColumn.name === column)) {
      this.database.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
    }
  }

  seedDatabase() {
    const existingUsers = this.database
      .prepare("SELECT COUNT(*) AS total FROM usuarios")
      .get().total;

    if (existingUsers > 0) {
      return;
    }

    this.database.exec("BEGIN TRANSACTION;");

    try {
      const passwordHash = this.hashPassword("123456");
      const insertUser = this.database.prepare(`
        INSERT INTO usuarios (nome, email, matricula, senha_hash, perfil)
        VALUES (?, ?, ?, ?, ?)
      `);

      insertUser.run(
        "Administrador EngNet",
        "admin@engnet.com",
        null,
        passwordHash,
        "administrador",
      );

      const teacherIds = [];

      teacherIds.push(
        Number(
          insertUser.run(
            "Prof. Carlos Henrique",
            "professor01@engnet.com",
            null,
            passwordHash,
            "professor",
          ).lastInsertRowid,
        ),
      );

      teacherIds.push(
        Number(
          insertUser.run(
            "Prof. Mariana Costa",
            "professor02@engnet.com",
            null,
            passwordHash,
            "professor",
          ).lastInsertRowid,
        ),
      );

      teacherIds.push(
        Number(
          insertUser.run(
            "Prof. Ricardo Almeida",
            "professor03@engnet.com",
            null,
            passwordHash,
            "professor",
          ).lastInsertRowid,
        ),
      );

      const studentNames = [
        "Ana Souza",
        "Bruno Lima",
        "Carla Mendes",
        "Daniel Rocha",
        "Eduarda Alves",
        "Felipe Costa",
        "Gabriela Martins",
        "Henrique Silva",
        "Isabela Santos",
        "Joao Oliveira",
        "Larissa Ferreira",
        "Matheus Gomes",
        "Natalia Ribeiro",
        "Pedro Henrique",
        "Rafaela Barbosa",
      ];

      const studentIds = studentNames.map((name, index) =>
        Number(
          insertUser.run(
            name,
            `aluno${String(index + 1).padStart(2, "0")}@engnet.com`,
            `2026${String(index + 1).padStart(4, "0")}`,
            passwordHash,
            "aluno",
          ).lastInsertRowid,
        ),
      );

      const insertClass = this.database.prepare(`
        INSERT INTO turmas (nome, codigo, horario, professor_id)
        VALUES (?, ?, ?, ?)
      `);

      const labId = Number(
        insertClass.run(
          "Laboratorio de Software",
          "LAB-SW-01",
          "Segunda, 19:00",
          teacherIds[0],
        ).lastInsertRowid,
      );

      const piId = Number(
        insertClass.run(
          "Projeto Integrador",
          "PI-01",
          "Quarta, 19:00",
          teacherIds[0],
        ).lastInsertRowid,
      );

      const redesId = Number(
        insertClass.run(
          "Redes de Computadores",
          "REDES-01",
          "Terça, 20:40",
          teacherIds[1],
        ).lastInsertRowid,
      );

      const bdId = Number(
        insertClass.run(
          "Banco de Dados",
          "BD-01",
          "Quinta, 20:40",
          teacherIds[2],
        ).lastInsertRowid,
      );

      const linkStudent = this.database.prepare(`
        INSERT INTO turma_alunos (turma_id, aluno_id)
        VALUES (?, ?)
      `);

      const turmaMap = {
        [labId]: [0, 1, 2, 3, 4, 5, 6],
        [piId]: [7, 8, 9, 10, 11, 12],
        [redesId]: [0, 2, 5, 7, 9, 13, 14],
        [bdId]: [1, 3, 4, 6, 8, 10, 13, 14],
      };

      Object.entries(turmaMap).forEach(([classId, indexes]) => {
        indexes.forEach((index) => {
          linkStudent.run(Number(classId), studentIds[index]);
        });
      });

      this.database.exec("COMMIT;");
    } catch (error) {
      this.database.exec("ROLLBACK;");
      throw error;
    }
  }

  hashPassword(password) {
    const salt = randomBytes(16).toString("hex");
    const hash = scryptSync(password, salt, 64).toString("hex");
    return `${salt}:${hash}`;
  }

  parseAttendanceThreshold(value) {
    const threshold = Number(value ?? 75);

    if (!Number.isFinite(threshold) || threshold < 0 || threshold > 100) {
      return 75;
    }

    return threshold;
  }

  getSummary() {
    const count = (table, condition = "") =>
      Number(
        this.database.prepare(`SELECT COUNT(*) AS total FROM ${table} ${condition}`).get().total,
      );

    return {
      usuarios: count("usuarios"),
      alunos: count("usuarios", "WHERE perfil = 'aluno'"),
      professores: count("usuarios", "WHERE perfil = 'professor'"),
      administradores: count("usuarios", "WHERE perfil = 'administrador'"),
      turmas: count("turmas"),
      aulas: count("aulas"),
      frequencias: count("frequencias"),
      limiteBaixaFrequencia: this.lowAttendanceThreshold,
    };
  }

  findUserByEmail(email) {
    return this.database
      .prepare(`
        SELECT
          id, nome, email, matricula, senha_hash, perfil, foto_url,
          telefone, departamento, ativo
        FROM usuarios
        WHERE email = ? AND ativo = 1
      `)
      .get(email);
  }

  createSession(usuarioId, tokenHash, expiresAt) {
    return this.database
      .prepare(`
        INSERT INTO sessoes (usuario_id, token_hash, expira_em)
        VALUES (?, ?, ?)
      `)
      .run(usuarioId, tokenHash, expiresAt);
  }

  findUserByValidSession(tokenHash, now) {
    return this.database
      .prepare(`
        SELECT
          u.id,
          u.nome,
          u.email,
          u.matricula,
          u.perfil,
          u.foto_url,
          u.telefone,
          u.departamento,
          u.ativo
        FROM sessoes s
        INNER JOIN usuarios u ON u.id = s.usuario_id
        WHERE s.token_hash = ?
          AND s.revogada_em IS NULL
          AND s.expira_em > ?
          AND u.ativo = 1
      `)
      .get(tokenHash, now);
  }

  revokeSession(tokenHash, revokedAt) {
    return this.database
      .prepare(`
        UPDATE sessoes
        SET revogada_em = ?
        WHERE token_hash = ? AND revogada_em IS NULL
      `)
      .run(revokedAt, tokenHash);
  }

  deleteExpiredSessions(now) {
    return this.database
      .prepare("DELETE FROM sessoes WHERE expira_em <= ? OR revogada_em IS NOT NULL")
      .run(now);
  }

  listClasses(profile, userId) {
    const where = profile === "professor" ? "WHERE t.professor_id = ?" : "";
    const parameters = profile === "professor" ? [userId] : [];

    return this.database
      .prepare(`
        SELECT
          t.id,
          t.nome,
          t.codigo,
          t.horario,
          t.professor_id,
          u.nome AS professor_nome,
          COUNT(aluno.id) AS quantidade_alunos,
          (
            SELECT CASE
              WHEN COUNT(f.id) = 0 THEN NULL
              ELSE ROUND(
                100.0 * SUM(CASE WHEN f.situacao = 'presente' THEN 1 ELSE 0 END) / COUNT(f.id),
                2
              )
            END
            FROM aulas a
            INNER JOIN frequencias f ON f.aula_id = a.id
            INNER JOIN turma_alunos ta_frequencia
              ON ta_frequencia.turma_id = t.id
              AND ta_frequencia.aluno_id = f.aluno_id
              AND ta_frequencia.ativo = 1
            INNER JOIN usuarios aluno_frequencia
              ON aluno_frequencia.id = f.aluno_id
              AND aluno_frequencia.ativo = 1
            WHERE a.turma_id = t.id AND a.status = 'finalizada'
          ) AS percentual_presenca
        FROM turmas t
        INNER JOIN usuarios u ON u.id = t.professor_id
        LEFT JOIN turma_alunos ta ON ta.turma_id = t.id AND ta.ativo = 1
        LEFT JOIN usuarios aluno ON aluno.id = ta.aluno_id AND aluno.ativo = 1
        ${where}
        GROUP BY t.id
        ORDER BY t.nome
      `)
      .all(...parameters);
  }

  findClassById(classId) {
    return this.database
      .prepare(`
        SELECT
          t.id,
          t.nome,
          t.codigo,
          t.horario,
          t.professor_id,
          u.nome AS professor_nome,
          COUNT(aluno.id) AS quantidade_alunos,
          (
            SELECT CASE
              WHEN COUNT(f.id) = 0 THEN NULL
              ELSE ROUND(
                100.0 * SUM(CASE WHEN f.situacao = 'presente' THEN 1 ELSE 0 END) / COUNT(f.id),
                2
              )
            END
            FROM aulas a
            INNER JOIN frequencias f ON f.aula_id = a.id
            INNER JOIN turma_alunos ta_frequencia
              ON ta_frequencia.turma_id = t.id
              AND ta_frequencia.aluno_id = f.aluno_id
              AND ta_frequencia.ativo = 1
            INNER JOIN usuarios aluno_frequencia
              ON aluno_frequencia.id = f.aluno_id
              AND aluno_frequencia.ativo = 1
            WHERE a.turma_id = t.id AND a.status = 'finalizada'
          ) AS percentual_presenca
        FROM turmas t
        INNER JOIN usuarios u ON u.id = t.professor_id
        LEFT JOIN turma_alunos ta ON ta.turma_id = t.id AND ta.ativo = 1
        LEFT JOIN usuarios aluno ON aluno.id = ta.aluno_id AND aluno.ativo = 1
        WHERE t.id = ?
        GROUP BY t.id
      `)
      .get(classId);
  }

  findClassByCode(code, ignoredClassId = null) {
    if (ignoredClassId) {
      return this.database
        .prepare("SELECT id FROM turmas WHERE codigo = ? AND id != ?")
        .get(code, ignoredClassId);
    }

    return this.database.prepare("SELECT id FROM turmas WHERE codigo = ?").get(code);
  }

  findProfessorById(professorId) {
    return this.database
      .prepare(`
        SELECT id, nome, email, foto_url, telefone, departamento, ativo
        FROM usuarios
        WHERE id = ? AND perfil = 'professor' AND ativo = 1
      `)
      .get(professorId);
  }

  listProfessors() {
    return this.database
      .prepare(`
        SELECT id, nome, email, foto_url, telefone, departamento, ativo
        FROM usuarios
        WHERE perfil = 'professor' AND ativo = 1
        ORDER BY nome
      `)
      .all();
  }

  createClass({ name, code, schedule, professorId }) {
    const result = this.database
      .prepare(`
        INSERT INTO turmas (nome, codigo, horario, professor_id)
        VALUES (?, ?, ?, ?)
      `)
      .run(name, code, schedule, professorId);

    return this.findClassById(Number(result.lastInsertRowid));
  }

  updateClass(classId, fields) {
    const entries = Object.entries(fields);
    const assignments = entries.map(([field]) => `${field} = ?`);
    const values = entries.map(([, value]) => value);

    assignments.push("atualizado_em = CURRENT_TIMESTAMP");

    this.database
      .prepare(`UPDATE turmas SET ${assignments.join(", ")} WHERE id = ?`)
      .run(...values, classId);

    return this.findClassById(classId);
  }

  listStudents() {
    return this.database
      .prepare(`
        SELECT id, nome, email, matricula, foto_url, telefone, departamento, ativo
        FROM usuarios
        WHERE perfil = 'aluno' AND ativo = 1
        ORDER BY nome
      `)
      .all();
  }

  findStudentById(studentId) {
    return this.database
      .prepare(`
        SELECT id, nome, email, matricula, foto_url, telefone, departamento, ativo
        FROM usuarios
        WHERE id = ? AND perfil = 'aluno'
      `)
      .get(studentId);
  }

  listClassStudents(classId) {
    return this.database
      .prepare(`
        SELECT u.id, u.nome, u.email, u.matricula, u.foto_url
        FROM turma_alunos ta
        INNER JOIN usuarios u ON u.id = ta.aluno_id
        WHERE ta.turma_id = ? AND ta.ativo = 1 AND u.ativo = 1
        ORDER BY u.nome
      `)
      .all(classId);
  }

  findClassStudent(classId, studentId) {
    return this.database
      .prepare(`
        SELECT turma_id
        FROM turma_alunos
        WHERE turma_id = ? AND aluno_id = ? AND ativo = 1
      `)
      .get(classId, studentId);
  }

  linkStudentToClass(classId, studentId) {
    this.database
      .prepare(`
        INSERT INTO turma_alunos (turma_id, aluno_id, ativo, desvinculado_em)
        VALUES (?, ?, 1, NULL)
        ON CONFLICT(turma_id, aluno_id) DO UPDATE SET
          ativo = 1,
          vinculado_em = CURRENT_TIMESTAMP,
          desvinculado_em = NULL
      `)
      .run(classId, studentId);
  }

  unlinkStudentFromClass(classId, studentId) {
    return this.database
      .prepare(`
        UPDATE turma_alunos
        SET ativo = 0, desvinculado_em = CURRENT_TIMESTAMP
        WHERE turma_id = ? AND aluno_id = ? AND ativo = 1
      `)
      .run(classId, studentId);
  }

  deleteClass(classId) {
    return this.database.prepare("DELETE FROM turmas WHERE id = ?").run(classId);
  }

  findUserById(userId) {
    return this.database
      .prepare(`
        SELECT
          id, nome, email, matricula, senha_hash, perfil, foto_url,
          telefone, departamento, ativo
        FROM usuarios
        WHERE id = ?
      `)
      .get(userId);
  }

  findUserByEmailIncludingInactive(email, ignoredUserId = null) {
    if (ignoredUserId !== null) {
      return this.database
        .prepare("SELECT id FROM usuarios WHERE email = ? AND id != ?")
        .get(email, ignoredUserId);
    }

    return this.database.prepare("SELECT id FROM usuarios WHERE email = ?").get(email);
  }

  findUserByRegistration(registration, ignoredUserId = null) {
    if (ignoredUserId !== null) {
      return this.database
        .prepare("SELECT id FROM usuarios WHERE matricula = ? AND id != ?")
        .get(registration, ignoredUserId);
    }

    return this.database.prepare("SELECT id FROM usuarios WHERE matricula = ?").get(registration);
  }

  createUser({ name, email, registration, passwordHash, profile, photoUrl, phone, department }) {
    const result = this.database
      .prepare(`
        INSERT INTO usuarios (
          nome, email, matricula, senha_hash, perfil, foto_url, telefone, departamento
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        name,
        email,
        registration,
        passwordHash,
        profile,
        photoUrl,
        phone,
        department,
      );

    return this.findUserById(Number(result.lastInsertRowid));
  }

  updateUser(userId, fields) {
    const entries = Object.entries(fields);
    const assignments = entries.map(([field]) => `${field} = ?`);
    const values = entries.map(([, value]) => value);

    assignments.push("atualizado_em = CURRENT_TIMESTAMP");
    this.database
      .prepare(`UPDATE usuarios SET ${assignments.join(", ")} WHERE id = ?`)
      .run(...values, userId);

    return this.findUserById(userId);
  }

  deactivateUser(userId) {
    this.database.exec("BEGIN IMMEDIATE TRANSACTION;");

    try {
      this.database
        .prepare(`
          UPDATE usuarios
          SET ativo = 0, atualizado_em = CURRENT_TIMESTAMP
          WHERE id = ?
        `)
        .run(userId);
      this.database
        .prepare(`
          UPDATE sessoes
          SET revogada_em = CURRENT_TIMESTAMP
          WHERE usuario_id = ? AND revogada_em IS NULL
        `)
        .run(userId);
      this.database
        .prepare(`
          UPDATE turma_alunos
          SET ativo = 0, desvinculado_em = CURRENT_TIMESTAMP
          WHERE aluno_id = ? AND ativo = 1
        `)
        .run(userId);
      this.database.exec("COMMIT;");
    } catch (error) {
      this.database.exec("ROLLBACK;");
      throw error;
    }

    return this.findUserById(userId);
  }

  countProfessorClasses(professorId) {
    return Number(
      this.database
        .prepare("SELECT COUNT(*) AS total FROM turmas WHERE professor_id = ?")
        .get(professorId).total,
    );
  }

  findLessonByClassDateTime(classId, date, schedule) {
    return this.database
      .prepare(`
        SELECT id
        FROM aulas
        WHERE turma_id = ? AND data = ? AND horario = ?
      `)
      .get(classId, date, schedule);
  }

  createLesson(classId, date, schedule) {
    const result = this.database
      .prepare(`
        INSERT INTO aulas (turma_id, data, horario)
        VALUES (?, ?, ?)
      `)
      .run(classId, date, schedule);

    return this.findLessonById(Number(result.lastInsertRowid));
  }

  findLessonById(lessonId) {
    return this.database
      .prepare(`
        SELECT
          a.id,
          a.turma_id,
          a.data,
          a.horario,
          a.status,
          t.nome AS turma_nome,
          t.codigo AS turma_codigo,
          t.professor_id
        FROM aulas a
        INNER JOIN turmas t ON t.id = a.turma_id
        WHERE a.id = ?
      `)
      .get(lessonId);
  }

  listClassLessons(classId) {
    return this.database
      .prepare(`
        SELECT
          a.id,
          a.turma_id,
          a.data,
          a.horario,
          a.status,
          COUNT(f.id) AS frequencias_registradas
        FROM aulas a
        LEFT JOIN frequencias f ON f.aula_id = a.id
        WHERE a.turma_id = ?
        GROUP BY a.id
        ORDER BY a.data DESC, a.horario DESC, a.id DESC
      `)
      .all(classId);
  }

  saveAttendance(lessonId, attendance) {
    const upsertAttendance = this.database.prepare(`
      INSERT INTO frequencias (aula_id, aluno_id, situacao)
      VALUES (?, ?, ?)
      ON CONFLICT(aula_id, aluno_id) DO UPDATE SET
        situacao = excluded.situacao,
        registrada_em = CURRENT_TIMESTAMP
    `);

    this.database.exec("BEGIN IMMEDIATE TRANSACTION;");

    try {
      attendance.forEach(({ studentId, status }) => {
        upsertAttendance.run(lessonId, studentId, status);
      });

      this.database
        .prepare("UPDATE aulas SET status = 'finalizada' WHERE id = ?")
        .run(lessonId);
      this.database.exec("COMMIT;");
    } catch (error) {
      this.database.exec("ROLLBACK;");
      throw error;
    }

    return this.findLessonById(lessonId);
  }

  listLessonAttendance(lessonId) {
    return this.database
      .prepare(`
        SELECT
          f.aluno_id,
          u.nome AS aluno_nome,
          u.matricula,
          f.situacao
        FROM frequencias f
        INNER JOIN usuarios u ON u.id = f.aluno_id
        WHERE f.aula_id = ?
        ORDER BY u.nome
      `)
      .all(lessonId);
  }

  listStudentClasses(studentId, profile, userId) {
    const professorFilter = profile === "professor" ? "AND t.professor_id = ?" : "";
    const parameters = profile === "professor" ? [studentId, userId] : [studentId];

    return this.database
      .prepare(`
        SELECT t.id, t.nome, t.codigo
        FROM turma_alunos ta
        INNER JOIN turmas t ON t.id = ta.turma_id
        WHERE ta.aluno_id = ? ${professorFilter}
        ORDER BY t.nome
      `)
      .all(...parameters);
  }

  listStudentAttendanceRecords(studentId, profile, userId) {
    const professorFilter = profile === "professor" ? "AND t.professor_id = ?" : "";
    const parameters = profile === "professor" ? [studentId, userId] : [studentId];

    return this.database
      .prepare(`
        SELECT
          t.id AS turma_id,
          a.id AS aula_id,
          a.data,
          a.horario,
          f.situacao
        FROM frequencias f
        INNER JOIN aulas a ON a.id = f.aula_id AND a.status = 'finalizada'
        INNER JOIN turmas t ON t.id = a.turma_id
        INNER JOIN turma_alunos ta
          ON ta.turma_id = t.id AND ta.aluno_id = f.aluno_id
        WHERE f.aluno_id = ? ${professorFilter}
        ORDER BY t.nome, a.data DESC, a.horario DESC, a.id DESC
      `)
      .all(...parameters);
  }

  getDashboardCounts(profile, userId) {
    if (profile === "professor") {
      return this.database
        .prepare(`
          SELECT
            COUNT(DISTINCT aluno.id) AS total_alunos,
            COUNT(DISTINCT a.id) AS total_aulas,
            1 AS total_professores,
            COUNT(DISTINCT t.id) AS total_turmas
          FROM turmas t
          LEFT JOIN turma_alunos ta ON ta.turma_id = t.id AND ta.ativo = 1
          LEFT JOIN usuarios aluno ON aluno.id = ta.aluno_id AND aluno.ativo = 1
          LEFT JOIN aulas a ON a.turma_id = t.id
          WHERE t.professor_id = ?
        `)
        .get(userId);
    }

    return this.database
      .prepare(`
        SELECT
          (SELECT COUNT(*) FROM usuarios WHERE perfil = 'aluno' AND ativo = 1) AS total_alunos,
          (SELECT COUNT(*) FROM aulas) AS total_aulas,
          (SELECT COUNT(*) FROM usuarios WHERE perfil = 'professor' AND ativo = 1) AS total_professores,
          (SELECT COUNT(*) FROM turmas) AS total_turmas
      `)
      .get();
  }

  listWeeklyAttendance(profile, userId) {
    const professorFilter = profile === "professor" ? "AND t.professor_id = ?" : "";
    const parameters = profile === "professor" ? [userId] : [];

    return this.database
      .prepare(`
        SELECT periodo, inicio, total_registros, presencas
        FROM (
          SELECT
            strftime('%Y-%W', a.data) AS periodo,
            MIN(a.data) AS inicio,
            COUNT(f.id) AS total_registros,
            COALESCE(SUM(CASE WHEN f.situacao = 'presente' THEN 1 ELSE 0 END), 0) AS presencas
          FROM aulas a
          INNER JOIN turmas t ON t.id = a.turma_id
          INNER JOIN frequencias f ON f.aula_id = a.id
          INNER JOIN usuarios u ON u.id = f.aluno_id AND u.ativo = 1
          WHERE a.status = 'finalizada' ${professorFilter}
          GROUP BY periodo
          ORDER BY periodo DESC
          LIMIT 8
        )
        ORDER BY periodo
      `)
      .all(...parameters);
  }

  listAttendanceSummaries(profile, userId, classId = null) {
    const conditions = [];
    const parameters = [];

    if (profile === "professor") {
      conditions.push("t.professor_id = ?");
      parameters.push(userId);
    }

    if (classId !== null) {
      conditions.push("t.id = ?");
      parameters.push(classId);
    }

    conditions.push("ta.ativo = 1", "u.ativo = 1");
    const where = `WHERE ${conditions.join(" AND ")}`;

    return this.database
      .prepare(`
        SELECT
          t.id AS turma_id,
          t.nome AS turma_nome,
          t.codigo AS turma_codigo,
          u.id AS aluno_id,
          u.nome AS aluno_nome,
          u.matricula,
          COUNT(f.id) AS total_aulas,
          COALESCE(SUM(CASE WHEN f.situacao = 'presente' THEN 1 ELSE 0 END), 0) AS presencas,
          COALESCE(SUM(CASE WHEN f.situacao = 'falta' THEN 1 ELSE 0 END), 0) AS faltas
        FROM turma_alunos ta
        INNER JOIN turmas t ON t.id = ta.turma_id
        INNER JOIN usuarios u ON u.id = ta.aluno_id
        LEFT JOIN aulas a ON a.turma_id = t.id AND a.status = 'finalizada'
        LEFT JOIN frequencias f ON f.aula_id = a.id AND f.aluno_id = u.id
        ${where}
        GROUP BY t.id, u.id
        ORDER BY t.nome, u.nome
      `)
      .all(...parameters);
  }

  listClassAttendanceDetails(classId) {
    return this.database
      .prepare(`
        SELECT
          a.id AS aula_id,
          a.data,
          a.horario,
          f.aluno_id,
          u.nome AS aluno_nome,
          u.matricula,
          f.situacao
        FROM aulas a
        INNER JOIN frequencias f ON f.aula_id = a.id
        INNER JOIN usuarios u ON u.id = f.aluno_id
        WHERE a.turma_id = ? AND a.status = 'finalizada'
        ORDER BY a.data DESC, a.horario DESC, a.id DESC, u.nome
      `)
      .all(classId);
  }

  onModuleDestroy() {
    this.database.close();
  }
}

Injectable()(DatabaseService);

module.exports = { DatabaseService }
