const { Body, Controller, HttpCode, Param, Put, Req, UseGuards } = require("@nestjs/common");
const { AuthGuard } = require("../auth/auth.guard");
const { FrequenciasService } = require("./frequencias.service");

class FrequenciasController {
  constructor(frequenciasService) {
    this.frequenciasService = frequenciasService;
  }

  saveAttendance(lessonId, body, request) {
    return this.frequenciasService.saveAttendance(lessonId, body, request.user);
  }
}

Reflect.defineMetadata("design:paramtypes", [FrequenciasService], FrequenciasController);
Controller("aulas")(FrequenciasController);

Param("aulaId")(FrequenciasController.prototype, "saveAttendance", 0);
Body()(FrequenciasController.prototype, "saveAttendance", 1);
Req()(FrequenciasController.prototype, "saveAttendance", 2);
HttpCode(200)(
  FrequenciasController.prototype,
  "saveAttendance",
  Object.getOwnPropertyDescriptor(FrequenciasController.prototype, "saveAttendance"),
);
UseGuards(AuthGuard)(
  FrequenciasController.prototype,
  "saveAttendance",
  Object.getOwnPropertyDescriptor(FrequenciasController.prototype, "saveAttendance"),
);
Put(":aulaId/frequencias")(
  FrequenciasController.prototype,
  "saveAttendance",
  Object.getOwnPropertyDescriptor(FrequenciasController.prototype, "saveAttendance"),
);

module.exports = { FrequenciasController };
