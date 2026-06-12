const { Injectable, UnauthorizedException } = require("@nestjs/common");
const { AuthService } = require("./auth.service");

class AuthGuard {
  constructor(authService) {
    this.authService = authService;
  }

  canActivate(context) {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Token de acesso não informado.");
    }

    const token = authorization.slice("Bearer ".length).trim();
    request.user = this.authService.authenticate(token);
    request.authToken = token;

    return true;
  }
}

Reflect.defineMetadata("design:paramtypes", [AuthService], AuthGuard);
Injectable()(AuthGuard);

module.exports = { AuthGuard };
