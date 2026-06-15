const {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} = require("@nestjs/common");
const {
  createHash,
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} = require("node:crypto");
const { DatabaseService } = require("../../database/database.service");

class AuthService {
  constructor(databaseService) {
    this.databaseService = databaseService;
    this.tokenExpirationHours = this.parseTokenExpiration(
      process.env.AUTH_TOKEN_EXPIRATION_HOURS,
    );
    this.statelessTokens =
      process.env.AUTH_STATELESS_TOKENS === "true" || process.env.VERCEL === "1";
    this.tokenSecret = process.env.AUTH_TOKEN_SECRET || "";
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
    const expiresAtDate = new Date(
      now.getTime() + this.tokenExpirationHours * 60 * 60 * 1000,
    );
    const expiresAt = expiresAtDate.toISOString();

    let token;

    if (this.statelessTokens) {
      token = this.createSignedToken(user.id, expiresAtDate);
    } else {
      token = randomBytes(32).toString("hex");
      const tokenHash = this.hashToken(token);

      this.databaseService.deleteExpiredSessions(now.toISOString());
      this.databaseService.createSession(user.id, tokenHash, expiresAt);
    }

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

    if (this.statelessTokens) {
      const payload = this.verifySignedToken(token);
      const user = this.databaseService.findUserById(payload.sub);

      if (!user || Number(user.ativo) !== 1) {
        throw new UnauthorizedException("Token de acesso inválido ou expirado.");
      }

      return this.toPublicUser(user);
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
    if (this.statelessTokens) {
      return {
        message: "Logout realizado com sucesso.",
      };
    }

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

  createSignedToken(userId, expiresAt) {
    this.ensureTokenSecret();

    const payload = {
      sub: Number(userId),
      exp: Math.floor(expiresAt.getTime() / 1000),
    };
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const signature = this.signTokenPayload(encodedPayload);

    return `${encodedPayload}.${signature}`;
  }

  verifySignedToken(token) {
    this.ensureTokenSecret();

    const [encodedPayload, signature] = String(token).split(".");

    if (!encodedPayload || !signature) {
      throw new UnauthorizedException("Token de acesso inválido ou expirado.");
    }

    const expectedSignature = this.signTokenPayload(encodedPayload);
    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (
      signatureBuffer.length !== expectedBuffer.length ||
      !timingSafeEqual(signatureBuffer, expectedBuffer)
    ) {
      throw new UnauthorizedException("Token de acesso inválido ou expirado.");
    }

    let payload;

    try {
      payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
    } catch {
      throw new UnauthorizedException("Token de acesso inválido ou expirado.");
    }

    if (!Number.isInteger(payload.sub) || !Number.isInteger(payload.exp)) {
      throw new UnauthorizedException("Token de acesso inválido ou expirado.");
    }

    if (payload.exp <= Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException("Token de acesso inválido ou expirado.");
    }

    return payload;
  }

  signTokenPayload(encodedPayload) {
    return createHmac("sha256", this.tokenSecret)
      .update(encodedPayload)
      .digest("base64url");
  }

  ensureTokenSecret() {
    if (!this.tokenSecret) {
      throw new InternalServerErrorException(
        "AUTH_TOKEN_SECRET deve ser configurado para autenticação em ambiente serverless.",
      );
    }
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
