const {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} = require("@nestjs/common");
const { DatabaseService } = require("../../database/database.service");
const { AuthService } = require("../auth/auth.service");

class UsuariosService {
  constructor(databaseService, authService) {
    this.databaseService = databaseService;
    this.authService = authService;
  }

  listStudents(user) {
    this.ensureStaff(user);
    return this.databaseService.listStudents().map((student) => this.toUserResponse(student));
  }

  listProfessors(user) {
    this.ensureAdmin(user);
    return this.databaseService
      .listProfessors()
      .map((professor) => this.toUserResponse(professor, true));
  }

  getUser(userIdValue, expectedProfile, user) {
    this.ensureAdmin(user);
    const foundUser = this.getUserByProfile(userIdValue, expectedProfile);
    const response = this.toUserResponse(foundUser, expectedProfile === "professor");

    if (expectedProfile === "professor") {
      response.turmas = this.databaseService
        .listClasses("professor", foundUser.id)
        .map((classData) => this.toClassSummary(classData));
    }

    if (expectedProfile === "aluno") {
      response.turmas = this.databaseService
        .listStudentClasses(foundUser.id, "administrador", user.id)
        .map((classData) => ({
          id: Number(classData.id),
          nome: classData.nome,
          codigo: classData.codigo,
        }));
    }

    return response;
  }

  createUser(payload, profile, user) {
    this.ensureAdmin(user);
    const fields = this.validateCreatePayload(payload, profile);
    const createdUser = this.databaseService.createUser({
      ...fields,
      passwordHash: this.databaseService.hashPassword(fields.password),
      profile,
    });

    return this.toUserResponse(createdUser, profile === "professor");
  }

  updateUser(userIdValue, payload, expectedProfile, user) {
    this.ensureAdmin(user);
    const foundUser = this.getUserByProfile(userIdValue, expectedProfile);
    const fields = this.validateUpdatePayload(payload, foundUser);

    if (Object.keys(fields).length === 0) {
      throw new BadRequestException("Informe ao menos um campo para atualizar.");
    }

    return this.toUserResponse(
      this.databaseService.updateUser(foundUser.id, fields),
      expectedProfile === "professor",
    );
  }

  resetPassword(userIdValue, payload, expectedProfile, user) {
    this.ensureAdmin(user);
    const foundUser = this.getUserByProfile(userIdValue, expectedProfile);
    const password = this.validPassword(payload?.novaSenha);
    this.databaseService.updateUser(foundUser.id, {
      senha_hash: this.databaseService.hashPassword(password),
    });

    return { message: "Senha redefinida com sucesso." };
  }

  deactivateUser(userIdValue, expectedProfile, user) {
    this.ensureAdmin(user);
    const foundUser = this.getUserByProfile(userIdValue, expectedProfile);

    if (!Number(foundUser.ativo)) {
      throw new ConflictException("O usuario ja esta desativado.");
    }

    if (
      expectedProfile === "professor" &&
      this.databaseService.countProfessorClasses(foundUser.id) > 0
    ) {
      throw new ConflictException(
        "Transfira as turmas deste professor antes de desativa-lo.",
      );
    }

    const deactivated = this.databaseService.deactivateUser(foundUser.id);
    return {
      message: `${expectedProfile === "professor" ? "Professor" : "Aluno"} desativado com sucesso.`,
      usuario: this.toUserResponse(deactivated, expectedProfile === "professor"),
    };
  }

  getProfile(user) {
    const foundUser = this.databaseService.findUserById(user.id);

    if (!foundUser || !Number(foundUser.ativo)) {
      throw new NotFoundException("Usuario nao encontrado.");
    }

    return this.toUserResponse(foundUser, foundUser.perfil === "professor");
  }

  updateProfile(payload, user) {
    const foundUser = this.databaseService.findUserById(user.id);
    const allowedPayload = {
      nome: payload?.nome,
      email: payload?.email,
      fotoUrl: payload?.fotoUrl,
      telefone: payload?.telefone,
    };
    const fields = this.validateUpdatePayload(allowedPayload, foundUser, true);

    if (Object.keys(fields).length === 0) {
      throw new BadRequestException("Informe ao menos um campo para atualizar.");
    }

    return this.toUserResponse(
      this.databaseService.updateUser(foundUser.id, fields),
      foundUser.perfil === "professor",
    );
  }

  changeOwnPassword(payload, user) {
    const foundUser = this.databaseService.findUserById(user.id);
    const currentPassword = typeof payload?.senhaAtual === "string" ? payload.senhaAtual : "";

    if (!this.authService.verifyPassword(currentPassword, foundUser.senha_hash)) {
      throw new UnauthorizedException("Senha atual incorreta.");
    }

    const newPassword = this.validPassword(payload?.novaSenha);

    if (currentPassword === newPassword) {
      throw new BadRequestException("A nova senha deve ser diferente da senha atual.");
    }

    this.databaseService.updateUser(foundUser.id, {
      senha_hash: this.databaseService.hashPassword(newPassword),
    });

    return { message: "Senha alterada com sucesso." };
  }

  validateCreatePayload(payload, profile) {
    const name = this.requiredText(payload?.nome, "Nome");
    const email = this.validEmail(payload?.email);
    const password = this.validPassword(payload?.senha);
    const registration =
      profile === "aluno" ? this.requiredText(payload?.matricula, "Matricula") : null;

    this.ensureUniqueEmail(email);

    if (registration) {
      this.ensureUniqueRegistration(registration);
    }

    return {
      name,
      email,
      registration,
      password,
      photoUrl: this.optionalText(payload?.fotoUrl),
      phone: this.optionalText(payload?.telefone),
      department:
        profile === "professor" ? this.optionalText(payload?.departamento) : null,
    };
  }

  validateUpdatePayload(payload, foundUser, profileEdit = false) {
    const fields = {};

    if (payload?.nome !== undefined) {
      fields.nome = this.requiredText(payload.nome, "Nome");
    }

    if (payload?.email !== undefined) {
      const email = this.validEmail(payload.email);
      this.ensureUniqueEmail(email, foundUser.id);
      fields.email = email;
    }

    if (!profileEdit && foundUser.perfil === "aluno" && payload?.matricula !== undefined) {
      const registration = this.requiredText(payload.matricula, "Matricula");
      this.ensureUniqueRegistration(registration, foundUser.id);
      fields.matricula = registration;
    }

    if (payload?.fotoUrl !== undefined) {
      fields.foto_url = this.optionalText(payload.fotoUrl);
    }

    if (payload?.telefone !== undefined) {
      fields.telefone = this.optionalText(payload.telefone);
    }

    if (!profileEdit && foundUser.perfil === "professor" && payload?.departamento !== undefined) {
      fields.departamento = this.optionalText(payload.departamento);
    }

    return fields;
  }

  getUserByProfile(userIdValue, expectedProfile) {
    const userId = this.positiveInteger(userIdValue, "Usuario");
    const foundUser = this.databaseService.findUserById(userId);

    if (!foundUser || foundUser.perfil !== expectedProfile) {
      throw new NotFoundException(
        `${expectedProfile === "professor" ? "Professor" : "Aluno"} nao encontrado.`,
      );
    }

    return foundUser;
  }

  ensureUniqueEmail(email, ignoredUserId = null) {
    if (this.databaseService.findUserByEmailIncludingInactive(email, ignoredUserId)) {
      throw new ConflictException("Ja existe um usuario com este e-mail.");
    }
  }

  ensureUniqueRegistration(registration, ignoredUserId = null) {
    if (this.databaseService.findUserByRegistration(registration, ignoredUserId)) {
      throw new ConflictException("Ja existe um aluno com esta matricula.");
    }
  }

  ensureAdmin(user) {
    if (user?.perfil !== "administrador") {
      throw new ForbiddenException("Apenas administradores podem realizar esta acao.");
    }
  }

  ensureStaff(user) {
    if (!user || !["professor", "administrador"].includes(user.perfil)) {
      throw new ForbiddenException("Apenas professores e administradores podem acessar este recurso.");
    }
  }

  positiveInteger(value, fieldName) {
    const number = Number(value);

    if (!Number.isInteger(number) || number <= 0) {
      throw new BadRequestException(`${fieldName} invalido.`);
    }

    return number;
  }

  requiredText(value, fieldName) {
    const text = typeof value === "string" ? value.trim() : "";

    if (!text) {
      throw new BadRequestException(`${fieldName} e obrigatorio.`);
    }

    return text;
  }

  optionalText(value) {
    if (value === null || value === "") {
      return null;
    }

    return typeof value === "string" ? value.trim() || null : null;
  }

  validEmail(value) {
    const email = this.requiredText(value, "E-mail").toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new BadRequestException("E-mail invalido.");
    }

    return email;
  }

  validPassword(value) {
    const password = typeof value === "string" ? value : "";

    if (password.length < 6) {
      throw new BadRequestException("A senha deve possuir ao menos 6 caracteres.");
    }

    return password;
  }

  toUserResponse(user, includeClassCount = false) {
    const response = {
      id: Number(user.id),
      nome: user.nome,
      email: user.email,
      matricula: user.matricula ?? null,
      perfil: user.perfil,
      fotoUrl: user.foto_url ?? null,
      telefone: user.telefone ?? null,
      departamento: user.departamento ?? null,
      ativo: Boolean(Number(user.ativo)),
    };

    if (includeClassCount) {
      response.quantidadeTurmas = this.databaseService.countProfessorClasses(user.id);
    }

    return response;
  }

  toClassSummary(classData) {
    return {
      id: Number(classData.id),
      nome: classData.nome,
      codigo: classData.codigo,
      horario: classData.horario,
      quantidadeAlunos: Number(classData.quantidade_alunos),
    };
  }
}

Reflect.defineMetadata("design:paramtypes", [DatabaseService, AuthService], UsuariosService);
Injectable()(UsuariosService);

module.exports = { UsuariosService };
