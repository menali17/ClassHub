const {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} = require("@nestjs/common");
const { AuthGuard } = require("../auth/auth.guard");
const { TurmasService } = require("./turmas.service");

class TurmasController {
  constructor(turmasService) {
    this.turmasService = turmasService;
  }

  listClasses(request) {
    return this.turmasService.listClasses(request.user);
  }

  createClass(body, request) {
    return this.turmasService.createClass(body, request.user);
  }

  getClass(id, request) {
    return this.turmasService.getClass(id, request.user);
  }

  updateClass(id, body, request) {
    return this.turmasService.updateClass(id, body, request.user);
  }

  listClassStudents(id, request) {
    return this.turmasService.listClassStudents(id, request.user);
  }

  linkStudent(id, body, request) {
    return this.turmasService.linkStudent(id, body, request.user);
  }
}

Reflect.defineMetadata("design:paramtypes", [TurmasService], TurmasController);
Controller("turmas")(TurmasController);

Req()(TurmasController.prototype, "listClasses", 0);
UseGuards(AuthGuard)(
  TurmasController.prototype,
  "listClasses",
  Object.getOwnPropertyDescriptor(TurmasController.prototype, "listClasses"),
);
Get()(TurmasController.prototype, "listClasses", Object.getOwnPropertyDescriptor(TurmasController.prototype, "listClasses"));

Body()(TurmasController.prototype, "createClass", 0);
Req()(TurmasController.prototype, "createClass", 1);
UseGuards(AuthGuard)(
  TurmasController.prototype,
  "createClass",
  Object.getOwnPropertyDescriptor(TurmasController.prototype, "createClass"),
);
Post()(TurmasController.prototype, "createClass", Object.getOwnPropertyDescriptor(TurmasController.prototype, "createClass"));

Param("id")(TurmasController.prototype, "getClass", 0);
Req()(TurmasController.prototype, "getClass", 1);
UseGuards(AuthGuard)(
  TurmasController.prototype,
  "getClass",
  Object.getOwnPropertyDescriptor(TurmasController.prototype, "getClass"),
);
Get(":id")(TurmasController.prototype, "getClass", Object.getOwnPropertyDescriptor(TurmasController.prototype, "getClass"));

Param("id")(TurmasController.prototype, "updateClass", 0);
Body()(TurmasController.prototype, "updateClass", 1);
Req()(TurmasController.prototype, "updateClass", 2);
UseGuards(AuthGuard)(
  TurmasController.prototype,
  "updateClass",
  Object.getOwnPropertyDescriptor(TurmasController.prototype, "updateClass"),
);
Patch(":id")(TurmasController.prototype, "updateClass", Object.getOwnPropertyDescriptor(TurmasController.prototype, "updateClass"));

Param("id")(TurmasController.prototype, "listClassStudents", 0);
Req()(TurmasController.prototype, "listClassStudents", 1);
UseGuards(AuthGuard)(
  TurmasController.prototype,
  "listClassStudents",
  Object.getOwnPropertyDescriptor(TurmasController.prototype, "listClassStudents"),
);
Get(":id/alunos")(
  TurmasController.prototype,
  "listClassStudents",
  Object.getOwnPropertyDescriptor(TurmasController.prototype, "listClassStudents"),
);

Param("id")(TurmasController.prototype, "linkStudent", 0);
Body()(TurmasController.prototype, "linkStudent", 1);
Req()(TurmasController.prototype, "linkStudent", 2);
HttpCode(200)(
  TurmasController.prototype,
  "linkStudent",
  Object.getOwnPropertyDescriptor(TurmasController.prototype, "linkStudent"),
);
UseGuards(AuthGuard)(
  TurmasController.prototype,
  "linkStudent",
  Object.getOwnPropertyDescriptor(TurmasController.prototype, "linkStudent"),
);
Post(":id/alunos")(
  TurmasController.prototype,
  "linkStudent",
  Object.getOwnPropertyDescriptor(TurmasController.prototype, "linkStudent"),
);

module.exports = { TurmasController };
