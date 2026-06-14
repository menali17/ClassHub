const { Controller, Get, Param, Query, Req, UseGuards } = require("@nestjs/common");
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

module.exports = { RelatoriosController };
