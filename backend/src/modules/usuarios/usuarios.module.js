const { Module } = require("@nestjs/common");
const { DatabaseModule } = require("../../database/database.module");
const { AuthModule } = require("../auth/auth.module");
const { AlunosController } = require("./alunos.controller");
const { PerfilController } = require("./perfil.controller");
const { ProfessoresController } = require("./professores.controller");
const { UsuariosService } = require("./usuarios.service");

class UsuariosModule {}

Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [AlunosController, ProfessoresController, PerfilController],
  providers: [UsuariosService],
})(UsuariosModule);

module.exports = { UsuariosModule };
