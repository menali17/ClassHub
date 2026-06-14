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

class ProfessoresController {
  constructor(usuariosService) { this.usuariosService = usuariosService; }
  list(request) { return this.usuariosService.listProfessors(request.user); }
  create(body, request) { return this.usuariosService.createUser(body, "professor", request.user); }
  get(id, request) { return this.usuariosService.getUser(id, "professor", request.user); }
  update(id, body, request) { return this.usuariosService.updateUser(id, body, "professor", request.user); }
  resetPassword(id, body, request) { return this.usuariosService.resetPassword(id, body, "professor", request.user); }
  remove(id, request) { return this.usuariosService.deactivateUser(id, "professor", request.user); }
}

Reflect.defineMetadata("design:paramtypes", [UsuariosService], ProfessoresController);
Controller("professores")(ProfessoresController);

Req()(ProfessoresController.prototype, "list", 0);
UseGuards(AuthGuard)(ProfessoresController.prototype, "list", Object.getOwnPropertyDescriptor(ProfessoresController.prototype, "list"));
Get()(ProfessoresController.prototype, "list", Object.getOwnPropertyDescriptor(ProfessoresController.prototype, "list"));

Body()(ProfessoresController.prototype, "create", 0);
Req()(ProfessoresController.prototype, "create", 1);
UseGuards(AuthGuard)(ProfessoresController.prototype, "create", Object.getOwnPropertyDescriptor(ProfessoresController.prototype, "create"));
Post()(ProfessoresController.prototype, "create", Object.getOwnPropertyDescriptor(ProfessoresController.prototype, "create"));

Param("id")(ProfessoresController.prototype, "get", 0);
Req()(ProfessoresController.prototype, "get", 1);
UseGuards(AuthGuard)(ProfessoresController.prototype, "get", Object.getOwnPropertyDescriptor(ProfessoresController.prototype, "get"));
Get(":id")(ProfessoresController.prototype, "get", Object.getOwnPropertyDescriptor(ProfessoresController.prototype, "get"));

Param("id")(ProfessoresController.prototype, "update", 0);
Body()(ProfessoresController.prototype, "update", 1);
Req()(ProfessoresController.prototype, "update", 2);
UseGuards(AuthGuard)(ProfessoresController.prototype, "update", Object.getOwnPropertyDescriptor(ProfessoresController.prototype, "update"));
Patch(":id")(ProfessoresController.prototype, "update", Object.getOwnPropertyDescriptor(ProfessoresController.prototype, "update"));

Param("id")(ProfessoresController.prototype, "resetPassword", 0);
Body()(ProfessoresController.prototype, "resetPassword", 1);
Req()(ProfessoresController.prototype, "resetPassword", 2);
HttpCode(200)(ProfessoresController.prototype, "resetPassword", Object.getOwnPropertyDescriptor(ProfessoresController.prototype, "resetPassword"));
UseGuards(AuthGuard)(ProfessoresController.prototype, "resetPassword", Object.getOwnPropertyDescriptor(ProfessoresController.prototype, "resetPassword"));
Post(":id/redefinir-senha")(ProfessoresController.prototype, "resetPassword", Object.getOwnPropertyDescriptor(ProfessoresController.prototype, "resetPassword"));

Param("id")(ProfessoresController.prototype, "remove", 0);
Req()(ProfessoresController.prototype, "remove", 1);
UseGuards(AuthGuard)(ProfessoresController.prototype, "remove", Object.getOwnPropertyDescriptor(ProfessoresController.prototype, "remove"));
Delete(":id")(ProfessoresController.prototype, "remove", Object.getOwnPropertyDescriptor(ProfessoresController.prototype, "remove"));

module.exports = { ProfessoresController };
