const {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} = require("@nestjs/common");
const { DatabaseService } = require("../../database/database.service");
const { FrequenciasService } = require("../frequencias/frequencias.service");
const { ExportacoesService } = require("./exportacoes.service");

class RelatoriosService {
  constructor(databaseService, frequenciasService, exportacoesService) {
    this.databaseService = databaseService;
    this.frequenciasService = frequenciasService;
    this.exportacoesService = exportacoesService;
  }

  getDashboard(user) {
    this.ensureStaff(user);
    const counts = this.databaseService.getDashboardCounts(user.perfil, user.id);
    const summaries = this.toAttendanceSummaries(
      this.databaseService.listAttendanceSummaries(user.perfil, user.id),
    );
    const totals = this.sumSummaries(summaries);

    return {
      totalAlunos: Number(counts.total_alunos),
      totalProfessores: Number(counts.total_professores),
      totalTurmas: Number(counts.total_turmas),
      totalAulas: Number(counts.total_aulas),
      taxaMediaPresenca: this.calculatePercentage(totals.presencas, totals.totalAulas),
      limiteBaixaFrequencia: this.databaseService.lowAttendanceThreshold,
      alunosComBaixaFrequencia: summaries
        .filter((summary) => summary.baixaFrequencia)
        .sort((first, second) => first.percentualPresenca - second.percentualPresenca)
        .map((summary) => ({
          id: summary.aluno.id,
          nome: summary.aluno.nome,
          matricula: summary.aluno.matricula,
          turmaId: summary.turma.id,
          turma: summary.turma.nome,
          percentualPresenca: summary.percentualPresenca,
        })),
    };
  }

  getIndividualReport(studentIdValue, user) {
    const attendance = this.frequenciasService.getStudentAttendance(studentIdValue, user);

    return {
      geradoEm: new Date().toISOString(),
      ...attendance,
    };
  }

  getLowAttendanceReport(classIdValue, user) {
    this.ensureStaff(user);
    let classData = null;

    if (classIdValue !== undefined) {
      classData = this.getAccessibleClass(classIdValue, user);
    }

    const summaries = this.toAttendanceSummaries(
      this.databaseService.listAttendanceSummaries(
        user.perfil,
        user.id,
        classData ? classData.id : null,
      ),
    )
      .filter((summary) => summary.baixaFrequencia)
      .sort((first, second) => first.percentualPresenca - second.percentualPresenca);

    return {
      geradoEm: new Date().toISOString(),
      limiteBaixaFrequencia: this.databaseService.lowAttendanceThreshold,
      turma: classData
        ? {
            id: Number(classData.id),
            nome: classData.nome,
            codigo: classData.codigo,
          }
        : null,
      totalAlunos: summaries.length,
      alunos: summaries.map((summary) => ({
        id: summary.aluno.id,
        nome: summary.aluno.nome,
        matricula: summary.aluno.matricula,
        turma: summary.turma,
        totalAulas: summary.totalAulas,
        presencas: summary.presencas,
        faltas: summary.faltas,
        percentualPresenca: summary.percentualPresenca,
      })),
    };
  }

  getClassReport(classIdValue, user) {
    const classData = this.getAccessibleClass(classIdValue, user);
    const summaries = this.toAttendanceSummaries(
      this.databaseService.listAttendanceSummaries(user.perfil, user.id, classData.id),
    );
    const details = this.databaseService.listClassAttendanceDetails(classData.id);
    const lessons = new Map();

    details.forEach((record) => {
      const lessonId = Number(record.aula_id);

      if (!lessons.has(lessonId)) {
        lessons.set(lessonId, {
          aulaId: lessonId,
          data: record.data,
          horario: record.horario,
          totalAlunos: 0,
          presentes: 0,
          faltas: 0,
          percentualPresenca: 0,
          frequencias: [],
        });
      }

      const lesson = lessons.get(lessonId);
      lesson.totalAlunos += 1;
      lesson[record.situacao === "presente" ? "presentes" : "faltas"] += 1;
      lesson.frequencias.push({
        alunoId: Number(record.aluno_id),
        nome: record.aluno_nome,
        matricula: record.matricula,
        situacao: record.situacao,
      });
    });

    const lessonHistory = Array.from(lessons.values()).map((lesson) => {
      lesson.percentualPresenca = this.calculatePercentage(
        lesson.presentes,
        lesson.totalAlunos,
      );
      return lesson;
    });
    const totals = this.sumSummaries(summaries);

    return {
      geradoEm: new Date().toISOString(),
      turma: {
        id: Number(classData.id),
        nome: classData.nome,
        codigo: classData.codigo,
        horario: classData.horario,
        professor: {
          id: Number(classData.professor_id),
          nome: classData.professor_nome,
        },
      },
      resumo: {
        totalAlunos: summaries.length,
        totalAulas: lessonHistory.length,
        presencas: totals.presencas,
        faltas: totals.faltas,
        percentualPresenca: this.calculatePercentage(totals.presencas, totals.totalAulas),
      },
      alunos: summaries.map((summary) => ({
        id: summary.aluno.id,
        nome: summary.aluno.nome,
        matricula: summary.aluno.matricula,
        totalAulas: summary.totalAulas,
        presencas: summary.presencas,
        faltas: summary.faltas,
        percentualPresenca: summary.percentualPresenca,
        baixaFrequencia: summary.baixaFrequencia,
      })),
      aulas: lessonHistory,
    };
  }

  async exportIndividualReport(studentIdValue, format, user) {
    return this.exportacoesService.individual(
      this.getIndividualReport(studentIdValue, user),
      format,
    );
  }

  async exportLowAttendanceReport(classIdValue, format, user) {
    return this.exportacoesService.lowAttendance(
      this.getLowAttendanceReport(classIdValue, user),
      format,
    );
  }

  async exportClassReport(classIdValue, format, user) {
    return this.exportacoesService.classReport(
      this.getClassReport(classIdValue, user),
      format,
    );
  }

  toAttendanceSummaries(records) {
    return records.map((record) => {
      const totalLessons = Number(record.total_aulas);
      const present = Number(record.presencas);
      const absences = Number(record.faltas);
      const percentage = this.calculatePercentage(present, totalLessons);

      return {
        turma: {
          id: Number(record.turma_id),
          nome: record.turma_nome,
          codigo: record.turma_codigo,
        },
        aluno: {
          id: Number(record.aluno_id),
          nome: record.aluno_nome,
          matricula: record.matricula,
        },
        totalAulas: totalLessons,
        presencas: present,
        faltas: absences,
        percentualPresenca: percentage,
        baixaFrequencia:
          totalLessons > 0 && percentage < this.databaseService.lowAttendanceThreshold,
      };
    });
  }

  sumSummaries(summaries) {
    return summaries.reduce(
      (totals, summary) => ({
        totalAulas: totals.totalAulas + summary.totalAulas,
        presencas: totals.presencas + summary.presencas,
        faltas: totals.faltas + summary.faltas,
      }),
      { totalAulas: 0, presencas: 0, faltas: 0 },
    );
  }

  getAccessibleClass(classIdValue, user) {
    this.ensureStaff(user);
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

  positiveInteger(value, fieldName) {
    const number = Number(value);

    if (!Number.isInteger(number) || number <= 0) {
      throw new BadRequestException(`${fieldName} invalida.`);
    }

    return number;
  }

  calculatePercentage(present, total) {
    return total === 0 ? 0 : Number(((present / total) * 100).toFixed(2));
  }
}

Reflect.defineMetadata(
  "design:paramtypes",
  [DatabaseService, FrequenciasService, ExportacoesService],
  RelatoriosService,
);
Injectable()(RelatoriosService);

module.exports = { RelatoriosService };
