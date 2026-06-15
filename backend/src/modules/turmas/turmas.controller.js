const {
  Body,
  Controller,
  Delete,
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
  
  listMyClasses(request) {
  return this.turmasService.listMyClasses(request.user);
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

  deleteClass(id, request) {
    return this.turmasService.deleteClass(id, request.user);
  }

  listClassStudents(id, request) {
    return this.turmasService.listClassStudents(id, request.user);
  }

  linkStudent(id, body, request) {
    return this.turmasService.linkStudent(id, body, request.user);
  }

  unlinkStudent(id, studentId, request) {
    return this.turmasService.unlinkStudent(id, studentId, request.user);
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

Req()(TurmasController.prototype, "listMyClasses", 0);
UseGuards(AuthGuard)(
  TurmasController.prototype,
  "listMyClasses",
  Object.getOwnPropertyDescriptor(TurmasController.prototype, "listMyClasses"),
);
Get("minhas")(
  TurmasController.prototype,
  "listMyClasses",
  Object.getOwnPropertyDescriptor(TurmasController.prototype, "listMyClasses"),
);

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

Param("id")(TurmasController.prototype, "deleteClass", 0);
Req()(TurmasController.prototype, "deleteClass", 1);
UseGuards(AuthGuard)(
  TurmasController.prototype,
  "deleteClass",
  Object.getOwnPropertyDescriptor(TurmasController.prototype, "deleteClass"),
);
Delete(":id")(TurmasController.prototype, "deleteClass", Object.getOwnPropertyDescriptor(TurmasController.prototype, "deleteClass"));

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

Param("id")(TurmasController.prototype, "unlinkStudent", 0);
Param("alunoId")(TurmasController.prototype, "unlinkStudent", 1);
Req()(TurmasController.prototype, "unlinkStudent", 2);
UseGuards(AuthGuard)(
  TurmasController.prototype,
  "unlinkStudent",
  Object.getOwnPropertyDescriptor(TurmasController.prototype, "unlinkStudent"),
);
Delete(":id/alunos/:alunoId")(
  TurmasController.prototype,
  "unlinkStudent",
  Object.getOwnPropertyDescriptor(TurmasController.prototype, "unlinkStudent"),
);

module.exports = { TurmasController };
