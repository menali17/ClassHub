const { BadRequestException, Injectable } = require("@nestjs/common");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");

class ExportacoesService {
  async allStudents(report, format) {
  const normalizedFormat = this.validateFormat(format);
  const baseName = "relatorio-geral-alunos";

  if (normalizedFormat === "xlsx") {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Alunos");

    sheet.columns = [
      { header: "Aluno", key: "nome", width: 28 },
      { header: "Matricula", key: "matricula", width: 16 },
      { header: "Turma", key: "turma", width: 28 },
      { header: "Aulas", key: "totalAulas", width: 10 },
      { header: "Presencas", key: "presencas", width: 12 },
      { header: "Faltas", key: "faltas", width: 10 },
      { header: "Percentual", key: "percentual", width: 14 },
      { header: "Situacao", key: "situacao", width: 18 },
    ];

    report.alunos.forEach((student) => {
      sheet.addRow({
        ...student,
        turma: student.turma.nome,
        percentual: `${student.percentualPresenca}%`,
        situacao: student.baixaFrequencia ? "Baixa frequencia" : "Regular",
      });
    });

    this.styleHeader(sheet);
    return this.excelResult(workbook, baseName);
  }

  return this.pdfResult(baseName, (document) => {
    this.pdfTitle(document, "Relatorio Geral por Aluno");
    document.text(`Total de alunos: ${report.totalAlunos}`);
    document.text(`Frequencia media: ${report.resumo.percentualPresenca}%`);
    document.moveDown();

    report.alunos.forEach((student) => {
      document.text(
        `${student.nome} | ${student.matricula || "-"} | ${student.turma.nome} | ${student.percentualPresenca}% | ${student.baixaFrequencia ? "Baixa frequencia" : "Regular"}`,
      );
    });
  });
}

async allClasses(report, format) {
  const normalizedFormat = this.validateFormat(format);
  const baseName = "relatorio-geral-turmas";

  if (normalizedFormat === "xlsx") {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Turmas");

    sheet.columns = [
      { header: "Turma", key: "nome", width: 28 },
      { header: "Codigo", key: "codigo", width: 16 },
      { header: "Alunos", key: "totalAlunos", width: 10 },
      { header: "Aulas", key: "totalAulas", width: 10 },
      { header: "Presencas", key: "presencas", width: 12 },
      { header: "Faltas", key: "faltas", width: 10 },
      { header: "Frequencia media", key: "percentual", width: 18 },
    ];

    report.turmas.forEach((turma) => {
      sheet.addRow({
        ...turma,
        percentual: `${turma.percentualPresenca}%`,
      });
    });

    this.styleHeader(sheet);
    return this.excelResult(workbook, baseName);
  }

  return this.pdfResult(baseName, (document) => {
    this.pdfTitle(document, "Relatorio Geral por Turma");
    document.text(`Total de turmas: ${report.totalTurmas}`);
    document.moveDown();

    report.turmas.forEach((turma) => {
      document.text(
        `${turma.nome} | ${turma.codigo || "-"} | ${turma.totalAlunos} alunos | ${turma.percentualPresenca}%`,
      );
    });
  });
}
  async individual(report, format) {
    const normalizedFormat = this.validateFormat(format);
    const baseName = `frequencia-${this.slug(report.aluno.nome)}`;

    if (normalizedFormat === "xlsx") {
      const workbook = new ExcelJS.Workbook();
      const summary = workbook.addWorksheet("Resumo");
      summary.addRows([
        ["Aluno", report.aluno.nome],
        ["Matricula", report.aluno.matricula],
        ["Total de aulas", report.resumoGeral.totalAulas],
        ["Presencas", report.resumoGeral.presencas],
        ["Faltas", report.resumoGeral.faltas],
        ["Percentual", `${report.resumoGeral.percentualPresenca}%`],
      ]);
      summary.getColumn(1).font = { bold: true };
      summary.columns = [{ width: 24 }, { width: 32 }];

      const history = workbook.addWorksheet("Historico");
      history.columns = [
        { header: "Turma", key: "turma", width: 28 },
        { header: "Data", key: "data", width: 14 },
        { header: "Horario", key: "horario", width: 12 },
        { header: "Situacao", key: "situacao", width: 14 },
      ];
      report.turmas.forEach((classData) => {
        classData.historico.forEach((record) => {
          history.addRow({ turma: classData.nome, ...record });
        });
      });
      this.styleHeader(history);
      return this.excelResult(workbook, baseName);
    }

    return this.pdfResult(baseName, (document) => {
      this.pdfTitle(document, "Relatorio Individual de Frequencia");
      document.text(`Aluno: ${report.aluno.nome}`);
      document.text(`Matricula: ${report.aluno.matricula || "-"}`);
      document.text(`Aulas: ${report.resumoGeral.totalAulas}`);
      document.text(`Presencas: ${report.resumoGeral.presencas}`);
      document.text(`Faltas: ${report.resumoGeral.faltas}`);
      document.text(`Percentual: ${report.resumoGeral.percentualPresenca}%`);
      report.turmas.forEach((classData) => {
        document.moveDown().font("Helvetica-Bold").text(classData.nome);
        document.font("Helvetica");
        classData.historico.forEach((record) => {
          document.text(`${record.data} ${record.horario} - ${record.situacao}`);
        });
      });
    });
  }

  async lowAttendance(report, format) {
    const normalizedFormat = this.validateFormat(format);
    const baseName = report.turma
      ? `baixa-frequencia-${this.slug(report.turma.codigo)}`
      : "baixa-frequencia-geral";

    if (normalizedFormat === "xlsx") {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Baixa frequencia");
      sheet.columns = [
        { header: "Aluno", key: "nome", width: 28 },
        { header: "Matricula", key: "matricula", width: 16 },
        { header: "Turma", key: "turma", width: 28 },
        { header: "Aulas", key: "totalAulas", width: 10 },
        { header: "Presencas", key: "presencas", width: 12 },
        { header: "Faltas", key: "faltas", width: 10 },
        { header: "Percentual", key: "percentual", width: 14 },
      ];
      report.alunos.forEach((student) => {
        sheet.addRow({
          ...student,
          turma: student.turma.nome,
          percentual: `${student.percentualPresenca}%`,
        });
      });
      this.styleHeader(sheet);
      return this.excelResult(workbook, baseName);
    }

    return this.pdfResult(baseName, (document) => {
      this.pdfTitle(document, "Relatorio de Baixa Frequencia");
      document.text(`Limite: abaixo de ${report.limiteBaixaFrequencia}%`);
      if (report.turma) document.text(`Turma: ${report.turma.nome}`);
      document.moveDown();
      report.alunos.forEach((student) => {
        document.text(
          `${student.nome} | ${student.matricula || "-"} | ${student.turma.nome} | ${student.percentualPresenca}%`,
        );
      });
    });
  }

  async classReport(report, format) {
    const normalizedFormat = this.validateFormat(format);
    const baseName = `turma-${this.slug(report.turma.codigo)}`;

    if (normalizedFormat === "xlsx") {
      const workbook = new ExcelJS.Workbook();
      const students = workbook.addWorksheet("Alunos");
      students.columns = [
        { header: "Aluno", key: "nome", width: 28 },
        { header: "Matricula", key: "matricula", width: 16 },
        { header: "Aulas", key: "totalAulas", width: 10 },
        { header: "Presencas", key: "presencas", width: 12 },
        { header: "Faltas", key: "faltas", width: 10 },
        { header: "Percentual", key: "percentual", width: 14 },
      ];
      report.alunos.forEach((student) => {
        students.addRow({ ...student, percentual: `${student.percentualPresenca}%` });
      });
      this.styleHeader(students);

      const lessons = workbook.addWorksheet("Aulas");
      lessons.columns = [
        { header: "Data", key: "data", width: 14 },
        { header: "Horario", key: "horario", width: 12 },
        { header: "Presentes", key: "presentes", width: 12 },
        { header: "Faltas", key: "faltas", width: 10 },
        { header: "Percentual", key: "percentual", width: 14 },
      ];
      report.aulas.forEach((lesson) => {
        lessons.addRow({ ...lesson, percentual: `${lesson.percentualPresenca}%` });
      });
      this.styleHeader(lessons);
      return this.excelResult(workbook, baseName);
    }

    return this.pdfResult(baseName, (document) => {
      this.pdfTitle(document, "Relatorio de Frequencia por Turma");
      document.text(`Turma: ${report.turma.nome} (${report.turma.codigo})`);
      document.text(`Professor: ${report.turma.professor.nome}`);
      document.text(`Aulas: ${report.resumo.totalAulas}`);
      document.text(`Frequencia media: ${report.resumo.percentualPresenca}%`);
      document.moveDown().font("Helvetica-Bold").text("Alunos");
      document.font("Helvetica");
      report.alunos.forEach((student) => {
        document.text(
          `${student.nome} | ${student.matricula || "-"} | ${student.percentualPresenca}%`,
        );
      });
    });
  }

  validateFormat(format) {
    const normalized = String(format || "pdf").toLowerCase();

    if (!["pdf", "xlsx"].includes(normalized)) {
      throw new BadRequestException("Formato invalido. Use pdf ou xlsx.");
    }

    return normalized;
  }

  async excelResult(workbook, baseName) {
    workbook.creator = "Sistema de Presenca EngNet";
    workbook.created = new Date();
    const data = await workbook.xlsx.writeBuffer();
    return {
      buffer: Buffer.from(data),
      contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      filename: `${baseName}.xlsx`,
    };
  }

  pdfResult(baseName, build) {
    return new Promise((resolve, reject) => {
      const document = new PDFDocument({ margin: 48, size: "A4" });
      const chunks = [];
      document.on("data", (chunk) => chunks.push(chunk));
      document.on("error", reject);
      document.on("end", () => resolve({
        buffer: Buffer.concat(chunks),
        contentType: "application/pdf",
        filename: `${baseName}.pdf`,
      }));
      build(document);
      document.end();
    });
  }

  pdfTitle(document, title) {
    document.font("Helvetica-Bold").fontSize(18).text(title);
    document.moveDown().font("Helvetica").fontSize(11);
  }

  styleHeader(sheet) {
    sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
    sheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFB91C1C" },
    };
    sheet.views = [{ state: "frozen", ySplit: 1 }];
  }

  slug(value) {
    return String(value || "relatorio")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
}

Injectable()(ExportacoesService);

module.exports = { ExportacoesService };
