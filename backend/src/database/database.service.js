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
        vinculado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
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

      CREATE INDEX IF NOT EXISTS idx_usuarios_perfil ON usuarios(perfil);
      CREATE INDEX IF NOT EXISTS idx_usuarios_matricula ON usuarios(matricula);
      CREATE INDEX IF NOT EXISTS idx_turmas_professor ON turmas(professor_id);
      CREATE INDEX IF NOT EXISTS idx_aulas_turma ON aulas(turma_id);
      CREATE INDEX IF NOT EXISTS idx_frequencias_aluno ON frequencias(aluno_id);
    `);
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
      const teacherId = Number(
        insertUser.run(
          "Professor EngNet",
          "professor@engnet.com",
          null,
          passwordHash,
          "professor",
        ).lastInsertRowid,
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
      const firstClassId = Number(
        insertClass.run("Laboratorio de Software", "LAB-SW-01", "Segunda, 19:00", teacherId)
          .lastInsertRowid,
      );
      const secondClassId = Number(
        insertClass.run("Projeto Integrador", "PI-01", "Quarta, 19:00", teacherId).lastInsertRowid,
      );

      const linkStudent = this.database.prepare(`
        INSERT INTO turma_alunos (turma_id, aluno_id)
        VALUES (?, ?)
      `);
      studentIds.forEach((studentId, index) => {
        const classId = index < 5 ? firstClassId : secondClassId;
        linkStudent.run(classId, studentId);
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

  onModuleDestroy() {
    this.database.close();
  }
}

Injectable()(DatabaseService);

module.exports = { DatabaseService };
