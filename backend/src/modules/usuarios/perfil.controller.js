const { Body, Controller, Get, Patch, Req, UseGuards } = require("@nestjs/common");
const { AuthGuard } = require("../auth/auth.guard");
const { UsuariosService } = require("./usuarios.service");

class PerfilController {
  constructor(usuariosService) { this.usuariosService = usuariosService; }
  get(request) { return this.usuariosService.getProfile(request.user); }
  update(body, request) { return this.usuariosService.updateProfile(body, request.user); }
  changePassword(body, request) { return this.usuariosService.changeOwnPassword(body, request.user); }
}

Reflect.defineMetadata("design:paramtypes", [UsuariosService], PerfilController);
Controller("perfil")(PerfilController);

Req()(PerfilController.prototype, "get", 0);
UseGuards(AuthGuard)(PerfilController.prototype, "get", Object.getOwnPropertyDescriptor(PerfilController.prototype, "get"));
Get()(PerfilController.prototype, "get", Object.getOwnPropertyDescriptor(PerfilController.prototype, "get"));

Body()(PerfilController.prototype, "update", 0);
Req()(PerfilController.prototype, "update", 1);
UseGuards(AuthGuard)(PerfilController.prototype, "update", Object.getOwnPropertyDescriptor(PerfilController.prototype, "update"));
Patch()(PerfilController.prototype, "update", Object.getOwnPropertyDescriptor(PerfilController.prototype, "update"));

Body()(PerfilController.prototype, "changePassword", 0);
Req()(PerfilController.prototype, "changePassword", 1);
UseGuards(AuthGuard)(PerfilController.prototype, "changePassword", Object.getOwnPropertyDescriptor(PerfilController.prototype, "changePassword"));
Patch("senha")(PerfilController.prototype, "changePassword", Object.getOwnPropertyDescriptor(PerfilController.prototype, "changePassword"));

module.exports = { PerfilController };
