const { Controller, Get, Param, Query, Req, Res, UseGuards } = require("@nestjs/common");
const { AuthGuard } = require("../auth/auth.guard");
const { RelatoriosService } = require("./relatorios.service");

class RelatoriosController {
  constructor(relatoriosService) {
    this.relatoriosService = relatoriosService;
  }

  getLowAttendanceReport(classId, request) {
    return this.relatoriosService.getLowAttendanceReport(classId, request.user);
  }

  getIndividualReport(studentId, request) {
    return this.relatoriosService.getIndividualReport(studentId, request.user);
  }

  getClassReport(classId, request) {
    return this.relatoriosService.getClassReport(classId, request.user);
  }

  async exportLowAttendance(classId, format, request, response) {
    return this.sendExport(
      response,
      await this.relatoriosService.exportLowAttendanceReport(classId, format, request.user),
    );
  }

  async exportIndividual(studentId, format, request, response) {
    return this.sendExport(
      response,
      await this.relatoriosService.exportIndividualReport(studentId, format, request.user),
    );
  }

  async exportClass(classId, format, request, response) {
    return this.sendExport(
      response,
      await this.relatoriosService.exportClassReport(classId, format, request.user),
    );
  }

  sendExport(response, file) {
    response.setHeader("Content-Type", file.contentType);
    response.setHeader("Content-Disposition", `attachment; filename="${file.filename}"`);
    return response.send(file.buffer);
  }
}

Reflect.defineMetadata("design:paramtypes", [RelatoriosService], RelatoriosController);
Controller("relatorios")(RelatoriosController);

Query("turmaId")(RelatoriosController.prototype, "getLowAttendanceReport", 0);
Req()(RelatoriosController.prototype, "getLowAttendanceReport", 1);
UseGuards(AuthGuard)(
  RelatoriosController.prototype,
  "getLowAttendanceReport",
  Object.getOwnPropertyDescriptor(RelatoriosController.prototype, "getLowAttendanceReport"),
);
Get("alunos-baixa-frequencia")(
  RelatoriosController.prototype,
  "getLowAttendanceReport",
  Object.getOwnPropertyDescriptor(RelatoriosController.prototype, "getLowAttendanceReport"),
);

Query("turmaId")(RelatoriosController.prototype, "exportLowAttendance", 0);
Query("formato")(RelatoriosController.prototype, "exportLowAttendance", 1);
Req()(RelatoriosController.prototype, "exportLowAttendance", 2);
Res()(RelatoriosController.prototype, "exportLowAttendance", 3);
UseGuards(AuthGuard)(RelatoriosController.prototype, "exportLowAttendance", Object.getOwnPropertyDescriptor(RelatoriosController.prototype, "exportLowAttendance"));
Get("alunos-baixa-frequencia/exportar")(RelatoriosController.prototype, "exportLowAttendance", Object.getOwnPropertyDescriptor(RelatoriosController.prototype, "exportLowAttendance"));

Param("alunoId")(RelatoriosController.prototype, "getIndividualReport", 0);
Req()(RelatoriosController.prototype, "getIndividualReport", 1);
UseGuards(AuthGuard)(
  RelatoriosController.prototype,
  "getIndividualReport",
  Object.getOwnPropertyDescriptor(RelatoriosController.prototype, "getIndividualReport"),
);
Get("alunos/:alunoId")(
  RelatoriosController.prototype,
  "getIndividualReport",
  Object.getOwnPropertyDescriptor(RelatoriosController.prototype, "getIndividualReport"),
);

Param("alunoId")(RelatoriosController.prototype, "exportIndividual", 0);
Query("formato")(RelatoriosController.prototype, "exportIndividual", 1);
Req()(RelatoriosController.prototype, "exportIndividual", 2);
Res()(RelatoriosController.prototype, "exportIndividual", 3);
UseGuards(AuthGuard)(RelatoriosController.prototype, "exportIndividual", Object.getOwnPropertyDescriptor(RelatoriosController.prototype, "exportIndividual"));
Get("alunos/:alunoId/exportar")(RelatoriosController.prototype, "exportIndividual", Object.getOwnPropertyDescriptor(RelatoriosController.prototype, "exportIndividual"));

Param("turmaId")(RelatoriosController.prototype, "getClassReport", 0);
Req()(RelatoriosController.prototype, "getClassReport", 1);
UseGuards(AuthGuard)(
  RelatoriosController.prototype,
  "getClassReport",
  Object.getOwnPropertyDescriptor(RelatoriosController.prototype, "getClassReport"),
);
Get("turmas/:turmaId")(
  RelatoriosController.prototype,
  "getClassReport",
  Object.getOwnPropertyDescriptor(RelatoriosController.prototype, "getClassReport"),
);

Param("turmaId")(RelatoriosController.prototype, "exportClass", 0);
Query("formato")(RelatoriosController.prototype, "exportClass", 1);
Req()(RelatoriosController.prototype, "exportClass", 2);
Res()(RelatoriosController.prototype, "exportClass", 3);
UseGuards(AuthGuard)(RelatoriosController.prototype, "exportClass", Object.getOwnPropertyDescriptor(RelatoriosController.prototype, "exportClass"));
Get("turmas/:turmaId/exportar")(RelatoriosController.prototype, "exportClass", Object.getOwnPropertyDescriptor(RelatoriosController.prototype, "exportClass"));

module.exports = { RelatoriosController };
