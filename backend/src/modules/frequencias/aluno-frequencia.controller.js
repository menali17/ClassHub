const { Controller, Get, Param, Req, UseGuards } = require("@nestjs/common");
const { AuthGuard } = require("../auth/auth.guard");
const { FrequenciasService } = require("./frequencias.service");

class AlunoFrequenciaController {
  constructor(frequenciasService) {
    this.frequenciasService = frequenciasService;
  }

  getMyAttendance(request) {
    return this.frequenciasService.getMyAttendance(request.user);
  }

  getStudentAttendance(studentId, request) {
    return this.frequenciasService.getStudentAttendance(studentId, request.user);
  }
}

Reflect.defineMetadata("design:paramtypes", [FrequenciasService], AlunoFrequenciaController);
Controller("alunos")(AlunoFrequenciaController);

Req()(AlunoFrequenciaController.prototype, "getMyAttendance", 0);
UseGuards(AuthGuard)(
  AlunoFrequenciaController.prototype,
  "getMyAttendance",
  Object.getOwnPropertyDescriptor(AlunoFrequenciaController.prototype, "getMyAttendance"),
);
Get("me/frequencia")(
  AlunoFrequenciaController.prototype,
  "getMyAttendance",
  Object.getOwnPropertyDescriptor(AlunoFrequenciaController.prototype, "getMyAttendance"),
);

Param("alunoId")(AlunoFrequenciaController.prototype, "getStudentAttendance", 0);
Req()(AlunoFrequenciaController.prototype, "getStudentAttendance", 1);
UseGuards(AuthGuard)(
  AlunoFrequenciaController.prototype,
  "getStudentAttendance",
  Object.getOwnPropertyDescriptor(AlunoFrequenciaController.prototype, "getStudentAttendance"),
);
Get(":alunoId/frequencia")(
  AlunoFrequenciaController.prototype,
  "getStudentAttendance",
  Object.getOwnPropertyDescriptor(AlunoFrequenciaController.prototype, "getStudentAttendance"),
);

module.exports = { AlunoFrequenciaController };
