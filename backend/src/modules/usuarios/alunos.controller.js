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
const { UsuariosService } = require("./usuarios.service");

class AlunosController {
  constructor(usuariosService) {
    this.usuariosService = usuariosService;
  }

  list(request) { return this.usuariosService.listStudents(request.user); }
  create(body, request) { return this.usuariosService.createUser(body, "aluno", request.user); }
  get(id, request) { return this.usuariosService.getUser(id, "aluno", request.user); }
  update(id, body, request) { return this.usuariosService.updateUser(id, body, "aluno", request.user); }
  resetPassword(id, body, request) { return this.usuariosService.resetPassword(id, body, "aluno", request.user); }
  remove(id, request) { return this.usuariosService.deactivateUser(id, "aluno", request.user); }
}

Reflect.defineMetadata("design:paramtypes", [UsuariosService], AlunosController);
Controller("alunos")(AlunosController);

Req()(AlunosController.prototype, "list", 0);
UseGuards(AuthGuard)(AlunosController.prototype, "list", Object.getOwnPropertyDescriptor(AlunosController.prototype, "list"));
Get()(AlunosController.prototype, "list", Object.getOwnPropertyDescriptor(AlunosController.prototype, "list"));

Body()(AlunosController.prototype, "create", 0);
Req()(AlunosController.prototype, "create", 1);
UseGuards(AuthGuard)(AlunosController.prototype, "create", Object.getOwnPropertyDescriptor(AlunosController.prototype, "create"));
Post()(AlunosController.prototype, "create", Object.getOwnPropertyDescriptor(AlunosController.prototype, "create"));

Param("id")(AlunosController.prototype, "get", 0);
Req()(AlunosController.prototype, "get", 1);
UseGuards(AuthGuard)(AlunosController.prototype, "get", Object.getOwnPropertyDescriptor(AlunosController.prototype, "get"));
Get(":id")(AlunosController.prototype, "get", Object.getOwnPropertyDescriptor(AlunosController.prototype, "get"));

Param("id")(AlunosController.prototype, "update", 0);
Body()(AlunosController.prototype, "update", 1);
Req()(AlunosController.prototype, "update", 2);
UseGuards(AuthGuard)(AlunosController.prototype, "update", Object.getOwnPropertyDescriptor(AlunosController.prototype, "update"));
Patch(":id")(AlunosController.prototype, "update", Object.getOwnPropertyDescriptor(AlunosController.prototype, "update"));

Param("id")(AlunosController.prototype, "resetPassword", 0);
Body()(AlunosController.prototype, "resetPassword", 1);
Req()(AlunosController.prototype, "resetPassword", 2);
HttpCode(200)(AlunosController.prototype, "resetPassword", Object.getOwnPropertyDescriptor(AlunosController.prototype, "resetPassword"));
UseGuards(AuthGuard)(AlunosController.prototype, "resetPassword", Object.getOwnPropertyDescriptor(AlunosController.prototype, "resetPassword"));
Post(":id/redefinir-senha")(AlunosController.prototype, "resetPassword", Object.getOwnPropertyDescriptor(AlunosController.prototype, "resetPassword"));

Param("id")(AlunosController.prototype, "remove", 0);
Req()(AlunosController.prototype, "remove", 1);
UseGuards(AuthGuard)(AlunosController.prototype, "remove", Object.getOwnPropertyDescriptor(AlunosController.prototype, "remove"));
Delete(":id")(AlunosController.prototype, "remove", Object.getOwnPropertyDescriptor(AlunosController.prototype, "remove"));

module.exports = { AlunosController };
