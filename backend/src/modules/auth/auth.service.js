const {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} = require("@nestjs/common");
const { createHash, randomBytes, scryptSync, timingSafeEqual } = require("node:crypto");
const { DatabaseService } = require("../../database/database.service");

class AuthService {
  constructor(databaseService) {
    this.databaseService = databaseService;
    this.tokenExpirationHours = this.parseTokenExpiration(
      process.env.AUTH_TOKEN_EXPIRATION_HOURS,
    );
  }

  login(payload) {
    const email = typeof payload?.email === "string" ? payload.email.trim().toLowerCase() : "";
    const password = typeof payload?.senha === "string" ? payload.senha : "";

    if (!email || !password) {
      throw new BadRequestException("E-mail e senha são obrigatórios.");
    }

    const user = this.databaseService.findUserByEmail(email);

    if (!user || !this.verifyPassword(password, user.senha_hash)) {
      throw new UnauthorizedException("E-mail ou senha inválidos.");
    }

    const now = new Date();
    const token = randomBytes(32).toString("hex");
    const tokenHash = this.hashToken(token);
    const expiresAt = new Date(
      now.getTime() + this.tokenExpirationHours * 60 * 60 * 1000,
    ).toISOString();

    this.databaseService.deleteExpiredSessions(now.toISOString());
    this.databaseService.createSession(user.id, tokenHash, expiresAt);

    return {
      token,
      expiraEm: expiresAt,
      usuario: this.toPublicUser(user),
    };
  }

  authenticate(token) {
    if (!token) {
      throw new UnauthorizedException("Token de acesso não informado.");
    }

    const user = this.databaseService.findUserByValidSession(
      this.hashToken(token),
      new Date().toISOString(),
    );

    if (!user) {
      throw new UnauthorizedException("Token de acesso inválido ou expirado.");
    }

    return this.toPublicUser(user);
  }

  logout(token) {
    const result = this.databaseService.revokeSession(
      this.hashToken(token),
      new Date().toISOString(),
    );

    if (Number(result.changes) === 0) {
      throw new UnauthorizedException("Sessão inválida ou já encerrada.");
    }

    return {
      message: "Logout realizado com sucesso.",
    };
  }

  verifyPassword(password, storedPassword) {
    const [salt, storedHash] = String(storedPassword).split(":");

    if (!salt || !storedHash) {
      return false;
    }

    const calculatedHash = scryptSync(password, salt, 64);
    const storedHashBuffer = Buffer.from(storedHash, "hex");

    return (
      calculatedHash.length === storedHashBuffer.length &&
      timingSafeEqual(calculatedHash, storedHashBuffer)
    );
  }

  hashToken(token) {
    return createHash("sha256").update(token).digest("hex");
  }

  toPublicUser(user) {
    return {
      id: Number(user.id),
      nome: user.nome,
      email: user.email,
      matricula: user.matricula ?? null,
      perfil: user.perfil,
      fotoUrl: user.foto_url ?? null,
      telefone: user.telefone ?? null,
      departamento: user.departamento ?? null,
    };
  }

  parseTokenExpiration(value) {
    const hours = Number(value ?? 8);
    return Number.isFinite(hours) && hours > 0 ? hours : 8;
  }
}

Reflect.defineMetadata("design:paramtypes", [DatabaseService], AuthService);
Injectable()(AuthService);

module.exports = { AuthService };
