const {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} = require("@nestjs/common");
const { DatabaseService } = require("../../database/database.service");

class TurmasService {
  constructor(databaseService) {
    this.databaseService = databaseService;
  }

  listClasses(user) {
    this.ensureStaff(user);
    return this.databaseService
      .listClasses(user.perfil, user.id)
      .map((classData) => this.toClassResponse(classData));
  }

    listMyClasses(user) {
    if (!user || user.perfil !== "aluno") {
      throw new ForbiddenException("Apenas alunos podem acessar suas próprias turmas.");
    }

    const summaries = this.databaseService.listAttendanceSummaries(user.perfil, user.id);
    const turmasMap = new Map();

    summaries.forEach((summary) => {
      const turmaId = Number(summary.turma_id);

      if (!turmasMap.has(turmaId)) {
        turmasMap.set(turmaId, {
          id: turmaId,
          nome: summary.turma_nome,
          codigo: summary.turma_codigo,
          horario: summary.horario ?? null,
          professor: {
            id: summary.professor_id ? Number(summary.professor_id) : null,
            nome: summary.professor_nome ?? "—",
          },
          totalAulas: 0,
          presencas: 0,
          faltas: 0,
        });
      }

      const turma = turmasMap.get(turmaId);
      turma.totalAulas += Number(summary.total_aulas);
      turma.presencas += Number(summary.presencas);
      turma.faltas += Number(summary.faltas);
    });

    return Array.from(turmasMap.values()).map((turma) => ({
      ...turma,
      quantidadeAlunos: 1,
      percentualPresenca: this.calculatePercentage(turma.presencas, turma.totalAulas),
    }));
  }

  getClass(classIdValue, user) {
    const classData = this.getAccessibleClass(classIdValue, user);
    return this.toClassResponse(classData);
  }

  createClass(payload, user) {
    this.ensureStaff(user);

    const name = this.requiredText(payload?.nome, "Nome");
    const code = this.requiredText(payload?.codigo, "Código").toUpperCase();
    const schedule = this.requiredText(payload?.horario, "Horário");
    const professorId = this.resolveProfessorId(payload?.professorId, user);

    if (this.databaseService.findClassByCode(code)) {
      throw new ConflictException("Já existe uma turma com este código.");
    }

    return this.toClassResponse(
      this.databaseService.createClass({ name, code, schedule, professorId }),
    );
  }

  updateClass(classIdValue, payload, user) {
    const classData = this.getAccessibleClass(classIdValue, user);
    const fields = {};

    if (payload?.nome !== undefined) {
      fields.nome = this.requiredText(payload.nome, "Nome");
    }

    if (payload?.codigo !== undefined) {
      const code = this.requiredText(payload.codigo, "Código").toUpperCase();

      if (this.databaseService.findClassByCode(code, classData.id)) {
        throw new ConflictException("Já existe uma turma com este código.");
      }

      fields.codigo = code;
    }

    if (payload?.horario !== undefined) {
      fields.horario = this.requiredText(payload.horario, "Horário");
    }

    if (payload?.professorId !== undefined) {
      if (user.perfil !== "administrador") {
        throw new ForbiddenException("Apenas administradores podem alterar o professor da turma.");
      }

      fields.professor_id = this.validateProfessorId(payload.professorId);
    }

    if (Object.keys(fields).length === 0) {
      throw new BadRequestException("Informe ao menos um campo para atualizar.");
    }

    return this.toClassResponse(this.databaseService.updateClass(classData.id, fields));
  }

  deleteClass(classIdValue, user) {
    if (user?.perfil !== "administrador") {
      throw new ForbiddenException("Apenas administradores podem excluir turmas.");
    }

    const classId = this.positiveInteger(classIdValue, "Turma");
    const classData = this.databaseService.findClassById(classId);

    if (!classData) {
      throw new NotFoundException("Turma nao encontrada.");
    }

    this.databaseService.deleteClass(classId);
    return { message: "Turma excluida com sucesso." };
  }

  listStudents(user) {
    this.ensureStaff(user);
    return this.databaseService.listStudents().map((student) => this.toStudentResponse(student));
  }

  listProfessors(user) {
    if (user?.perfil !== "administrador") {
      throw new ForbiddenException("Apenas administradores podem listar professores.");
    }

    return this.databaseService.listProfessors().map((professor) => ({
      id: Number(professor.id),
      nome: professor.nome,
      email: professor.email,
      fotoUrl: professor.foto_url ?? null,
    }));
  }

  listClassStudents(classIdValue, user) {
    const classData = this.getAccessibleClass(classIdValue, user);
    const students = this.databaseService
      .listClassStudents(classData.id)
      .map((student) => this.toStudentResponse(student));

    return {
      turma: this.toClassResponse(classData, false),
      quantidadeAlunos: students.length,
      alunos: students,
    };
  }

  linkStudent(classIdValue, payload, user) {
    const classData = this.getAccessibleClass(classIdValue, user);
    const studentId = this.positiveInteger(payload?.alunoId, "Aluno");
    const student = this.databaseService.findStudentById(studentId);

    if (!student || !Number(student.ativo)) {
      throw new NotFoundException("Aluno não encontrado.");
    }

    if (this.databaseService.findClassStudent(classData.id, studentId)) {
      throw new ConflictException("O aluno já está vinculado a esta turma.");
    }

    this.databaseService.linkStudentToClass(classData.id, studentId);

    return {
      message: "Aluno vinculado à turma com sucesso.",
      aluno: this.toStudentResponse(student),
      turma: this.toClassResponse(this.databaseService.findClassById(classData.id)),
    };
  }

  unlinkStudent(classIdValue, studentIdValue, user) {
    const classData = this.getAccessibleClass(classIdValue, user);
    const studentId = this.positiveInteger(studentIdValue, "Aluno");

    if (!this.databaseService.findClassStudent(classData.id, studentId)) {
      throw new NotFoundException("O aluno nao esta vinculado a esta turma.");
    }

    this.databaseService.unlinkStudentFromClass(classData.id, studentId);
    return { message: "Aluno removido da turma com sucesso." };
  }

  getAccessibleClass(classIdValue, user) {
    this.ensureStaff(user);
    const classId = this.positiveInteger(classIdValue, "Turma");
    const classData = this.databaseService.findClassById(classId);

    if (!classData) {
      throw new NotFoundException("Turma não encontrada.");
    }

    if (user.perfil === "professor" && Number(classData.professor_id) !== Number(user.id)) {
      throw new ForbiddenException("Você não possui acesso a esta turma.");
    }

    return classData;
  }

  ensureStaff(user) {
    if (!user || !["professor", "administrador"].includes(user.perfil)) {
      throw new ForbiddenException("Apenas professores e administradores podem acessar este recurso.");
    }
  }

  resolveProfessorId(professorIdValue, user) {
    if (user.perfil === "professor") {
      return Number(user.id);
    }

    if (professorIdValue === undefined || professorIdValue === null) {
      throw new BadRequestException("Professor responsável é obrigatório para administradores.");
    }

    return this.validateProfessorId(professorIdValue);
  }

  validateProfessorId(value) {
    const professorId = this.positiveInteger(value, "Professor");

    if (!this.databaseService.findProfessorById(professorId)) {
      throw new NotFoundException("Professor não encontrado.");
    }

    return professorId;
  }

  positiveInteger(value, fieldName) {
    const number = Number(value);

    if (!Number.isInteger(number) || number <= 0) {
      throw new BadRequestException(`${fieldName} inválido.`);
    }

    return number;
  }

  requiredText(value, fieldName) {
    const text = typeof value === "string" ? value.trim() : "";

    if (!text) {
      throw new BadRequestException(`${fieldName} é obrigatório.`);
    }

    return text;
  }

  calculatePercentage(present, total) {
    return total === 0 ? 0 : Number(((present / total) * 100).toFixed(2));
  }

  toClassResponse(classData, includeQuantity = true) {
    const response = {
      id: Number(classData.id),
      nome: classData.nome,
      codigo: classData.codigo,
      horario: classData.horario,
      professor: {
        id: Number(classData.professor_id),
        nome: classData.professor_nome,
      },
    };

    if (includeQuantity) {
      response.quantidadeAlunos = Number(classData.quantidade_alunos);
      response.percentualPresenca =
        classData.percentual_presenca === null || classData.percentual_presenca === undefined
          ? null
          : Number(classData.percentual_presenca);
    }

    return response;
  }

  toStudentResponse(student) {
    return {
      id: Number(student.id),
      nome: student.nome,
      email: student.email,
      matricula: student.matricula,
      fotoUrl: student.foto_url ?? null,
    };
  }
}

Reflect.defineMetadata("design:paramtypes", [DatabaseService], TurmasService);
Injectable()(TurmasService);

module.exports = { TurmasService };
