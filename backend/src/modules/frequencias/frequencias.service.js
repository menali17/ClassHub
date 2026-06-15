const {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} = require("@nestjs/common");
const { DatabaseService } = require("../../database/database.service");

class FrequenciasService {
  constructor(databaseService) {
    this.databaseService = databaseService;
  }

  createLesson(classIdValue, payload, user) {
    const classData = this.getAccessibleClass(classIdValue, user, true);
    const date = this.validDate(payload?.data);
    const schedule = this.validSchedule(payload?.horario);

    if (this.databaseService.findLessonByClassDateTime(classData.id, date, schedule)) {
      throw new ConflictException("Ja existe uma aula desta turma na data e horario informados.");
    }

    return this.toLessonResponse(this.databaseService.createLesson(classData.id, date, schedule));
  }

  listLessons(classIdValue, user) {
    const classData = this.getAccessibleClass(classIdValue, user);

    return {
      turma: {
        id: Number(classData.id),
        nome: classData.nome,
        codigo: classData.codigo,
      },
      aulas: this.databaseService
        .listClassLessons(classData.id)
        .map((lesson) => this.toLessonResponse(lesson)),
    };
  }

  saveAttendance(lessonIdValue, payload, user) {
    this.ensureTeacher(user);
    const lessonId = this.positiveInteger(lessonIdValue, "Aula");
    const lesson = this.databaseService.findLessonById(lessonId);

    if (!lesson) {
      throw new NotFoundException("Aula nao encontrada.");
    }

    if (Number(lesson.professor_id) !== Number(user.id)) {
      throw new ForbiddenException("Voce nao possui acesso a esta aula.");
    }

    const students = this.databaseService.listClassStudents(lesson.turma_id);
    const attendance = this.validateAttendance(payload?.frequencias, students);
    const updatedLesson = this.databaseService.saveAttendance(lessonId, attendance);
    const records = this.databaseService.listLessonAttendance(lessonId);
    const present = records.filter((record) => record.situacao === "presente").length;

    return {
      message: "Chamada registrada com sucesso.",
      aula: this.toLessonResponse(updatedLesson),
      resumo: {
        totalAlunos: records.length,
        presentes: present,
        faltas: records.length - present,
      },
      frequencias: records.map((record) => ({
        alunoId: Number(record.aluno_id),
        nome: record.aluno_nome,
        matricula: record.matricula,
        situacao: record.situacao,
      })),
    };
  }

  getMyAttendance(user) {
    if (user?.perfil !== "aluno") {
      throw new ForbiddenException("Apenas alunos podem consultar a propria frequencia.");
    }

    return this.buildStudentAttendance(Number(user.id), user);
  }

  getStudentAttendance(studentIdValue, user) {
    this.ensureStaff(user);
    const studentId = this.positiveInteger(studentIdValue, "Aluno");
    return this.buildStudentAttendance(studentId, user);
  }

  buildStudentAttendance(studentId, user) {
    const student = this.databaseService.findStudentById(studentId);

    if (!student) {
      throw new NotFoundException("Aluno nao encontrado.");
    }

    const classes = this.databaseService.listStudentClasses(studentId, user.perfil, user.id);

    if (user.perfil === "professor" && classes.length === 0) {
      throw new ForbiddenException("Voce nao possui acesso a frequencia deste aluno.");
    }

    const classSummaries = new Map(
      classes.map((classData) => [
        Number(classData.id),
        {
          turmaId: Number(classData.id),
          nome: classData.nome,
          codigo: classData.codigo,
          totalAulas: 0,
          presencas: 0,
          faltas: 0,
          percentualPresenca: 0,
          baixaFrequencia: false,
          historico: [],
        },
      ]),
    );

    const records = this.databaseService.listStudentAttendanceRecords(
      studentId,
      user.perfil,
      user.id,
    );

    records.forEach((record) => {
      const summary = classSummaries.get(Number(record.turma_id));

      if (!summary) {
        return;
      }

      summary.totalAulas += 1;
      summary[record.situacao === "presente" ? "presencas" : "faltas"] += 1;
      summary.historico.push({
        aulaId: Number(record.aula_id),
        data: record.data,
        horario: record.horario,
        situacao: record.situacao,
      });
    });

    const attendanceByClass = Array.from(classSummaries.values()).map((summary) => {
      summary.percentualPresenca = this.calculatePercentage(summary.presencas, summary.totalAulas);
      summary.baixaFrequencia = this.isLowAttendance(
        summary.percentualPresenca,
        summary.totalAulas,
      );
      return summary;
    });

    const general = attendanceByClass.reduce(
      (result, summary) => ({
        totalAulas: result.totalAulas + summary.totalAulas,
        presencas: result.presencas + summary.presencas,
        faltas: result.faltas + summary.faltas,
      }),
      { totalAulas: 0, presencas: 0, faltas: 0 },
    );
    const generalPercentage = this.calculatePercentage(general.presencas, general.totalAulas);

    return {
      limiteBaixaFrequencia: this.databaseService.lowAttendanceThreshold,
      aluno: {
        id: Number(student.id),
        nome: student.nome,
        matricula: student.matricula,
      },
      resumoGeral: {
        ...general,
        percentualPresenca: generalPercentage,
        baixaFrequencia: this.isLowAttendance(generalPercentage, general.totalAulas),
      },
      turmas: attendanceByClass,
    };
  }

  validateAttendance(value, students) {
    if (!Array.isArray(value) || value.length === 0) {
      throw new BadRequestException("Informe a frequencia de todos os alunos da turma.");
    }

    if (students.length === 0) {
      throw new BadRequestException("A turma nao possui alunos vinculados.");
    }

    const classStudentIds = new Set(students.map((student) => Number(student.id)));
    const receivedIds = new Set();
    const attendance = value.map((record) => {
      const studentId = this.positiveInteger(record?.alunoId, "Aluno");
      const status = record?.situacao;

      if (!classStudentIds.has(studentId)) {
        throw new BadRequestException("A chamada contem um aluno que nao pertence a turma.");
      }

      if (receivedIds.has(studentId)) {
        throw new ConflictException("A chamada possui registros duplicados para o mesmo aluno.");
      }

      if (!["presente", "falta"].includes(status)) {
        throw new BadRequestException("A situacao deve ser presente ou falta.");
      }

      receivedIds.add(studentId);
      return { studentId, status };
    });

    if (receivedIds.size !== classStudentIds.size) {
      throw new BadRequestException("A chamada deve informar todos os alunos da turma.");
    }

    return attendance;
  }

  getAccessibleClass(classIdValue, user, teacherOnly = false) {
    this.ensureStaff(user);

    if (teacherOnly) {
      this.ensureTeacher(user);
    }

    const classId = this.positiveInteger(classIdValue, "Turma");
    const classData = this.databaseService.findClassById(classId);

    if (!classData) {
      throw new NotFoundException("Turma nao encontrada.");
    }

    if (user.perfil === "professor" && Number(classData.professor_id) !== Number(user.id)) {
      throw new ForbiddenException("Voce nao possui acesso a esta turma.");
    }

    return classData;
  }

  ensureStaff(user) {
    if (!user || !["professor", "administrador"].includes(user.perfil)) {
      throw new ForbiddenException("Apenas professores e administradores podem acessar este recurso.");
    }
  }

  ensureTeacher(user) {
    if (user?.perfil !== "professor") {
      throw new ForbiddenException("Apenas professores podem registrar aulas e frequencias.");
    }
  }

  positiveInteger(value, fieldName) {
    const number = Number(value);

    if (!Number.isInteger(number) || number <= 0) {
      throw new BadRequestException(`${fieldName} invalido.`);
    }

    return number;
  }

  validDate(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      throw new BadRequestException("Data invalida. Use o formato AAAA-MM-DD.");
    }

    const date = new Date(`${value}T00:00:00.000Z`);

    if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
      throw new BadRequestException("Data invalida.");
    }

    return value;
  }

  validSchedule(value) {
    if (typeof value !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
      throw new BadRequestException("Horario invalido. Use o formato HH:mm.");
    }

    return value;
  }

  calculatePercentage(present, total) {
    return total === 0 ? 0 : Number(((present / total) * 100).toFixed(2));
  }

  isLowAttendance(percentage, total) {
    return total > 0 && percentage < this.databaseService.lowAttendanceThreshold;
  }

  toLessonResponse(lesson) {
    const response = {
      id: Number(lesson.id),
      turmaId: Number(lesson.turma_id),
      data: lesson.data,
      horario: lesson.horario,
      status: lesson.status,
    };

    if (lesson.frequencias_registradas !== undefined) {
      response.frequenciasRegistradas = Number(lesson.frequencias_registradas);
    }

    return response;
  }
}

Reflect.defineMetadata("design:paramtypes", [DatabaseService], FrequenciasService);
Injectable()(FrequenciasService);

module.exports = { FrequenciasService };
