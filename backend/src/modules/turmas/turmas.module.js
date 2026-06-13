const { Module } = require("@nestjs/common");
const { DatabaseModule } = require("../../database/database.module");
const { AuthModule } = require("../auth/auth.module");
const { AlunosController } = require("./alunos.controller");
const { ProfessoresController } = require("./professores.controller");
const { TurmasController } = require("./turmas.controller");
const { TurmasService } = require("./turmas.service");

class TurmasModule {}

Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [TurmasController, AlunosController, ProfessoresController],
  providers: [TurmasService],
})(TurmasModule);

module.exports = { TurmasModule };
