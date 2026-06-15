const { Body, Controller, Get, Param, Post, Req, UseGuards } = require("@nestjs/common");
const { AuthGuard } = require("../auth/auth.guard");
const { FrequenciasService } = require("./frequencias.service");

class AulasController {
  constructor(frequenciasService) {
    this.frequenciasService = frequenciasService;
  }

  createLesson(classId, body, request) {
    return this.frequenciasService.createLesson(classId, body, request.user);
  }

  listLessons(classId, request) {
    return this.frequenciasService.listLessons(classId, request.user);
  }
}

Reflect.defineMetadata("design:paramtypes", [FrequenciasService], AulasController);
Controller("turmas")(AulasController);

Param("turmaId")(AulasController.prototype, "createLesson", 0);
Body()(AulasController.prototype, "createLesson", 1);
Req()(AulasController.prototype, "createLesson", 2);
UseGuards(AuthGuard)(
  AulasController.prototype,
  "createLesson",
  Object.getOwnPropertyDescriptor(AulasController.prototype, "createLesson"),
);
Post(":turmaId/aulas")(
  AulasController.prototype,
  "createLesson",
  Object.getOwnPropertyDescriptor(AulasController.prototype, "createLesson"),
);

Param("turmaId")(AulasController.prototype, "listLessons", 0);
Req()(AulasController.prototype, "listLessons", 1);
UseGuards(AuthGuard)(
  AulasController.prototype,
  "listLessons",
  Object.getOwnPropertyDescriptor(AulasController.prototype, "listLessons"),
);
Get(":turmaId/aulas")(
  AulasController.prototype,
  "listLessons",
  Object.getOwnPropertyDescriptor(AulasController.prototype, "listLessons"),
);

module.exports = { AulasController };
