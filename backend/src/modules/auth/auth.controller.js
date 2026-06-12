const { Body, Controller, Get, HttpCode, Post, Req, UseGuards } = require("@nestjs/common");
const { AuthGuard } = require("./auth.guard");
const { AuthService } = require("./auth.service");

class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  login(body) {
    return this.authService.login(body);
  }

  getCurrentUser(request) {
    return request.user;
  }

  logout(request) {
    return this.authService.logout(request.authToken);
  }
}

Reflect.defineMetadata("design:paramtypes", [AuthService], AuthController);
Controller("auth")(AuthController);

Body()(AuthController.prototype, "login", 0);
HttpCode(200)(
  AuthController.prototype,
  "login",
  Object.getOwnPropertyDescriptor(AuthController.prototype, "login"),
);
Post("login")(
  AuthController.prototype,
  "login",
  Object.getOwnPropertyDescriptor(AuthController.prototype, "login"),
);

Req()(AuthController.prototype, "getCurrentUser", 0);
UseGuards(AuthGuard)(
  AuthController.prototype,
  "getCurrentUser",
  Object.getOwnPropertyDescriptor(AuthController.prototype, "getCurrentUser"),
);
Get("me")(
  AuthController.prototype,
  "getCurrentUser",
  Object.getOwnPropertyDescriptor(AuthController.prototype, "getCurrentUser"),
);

Req()(AuthController.prototype, "logout", 0);
HttpCode(200)(
  AuthController.prototype,
  "logout",
  Object.getOwnPropertyDescriptor(AuthController.prototype, "logout"),
);
UseGuards(AuthGuard)(
  AuthController.prototype,
  "logout",
  Object.getOwnPropertyDescriptor(AuthController.prototype, "logout"),
);
Post("logout")(
  AuthController.prototype,
  "logout",
  Object.getOwnPropertyDescriptor(AuthController.prototype, "logout"),
);

module.exports = { AuthController };
