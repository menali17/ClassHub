const { Module } = require("@nestjs/common");
const { DatabaseModule } = require("../../database/database.module");
const { AuthModule } = require("../auth/auth.module");
const { AlunoFrequenciaController } = require("./aluno-frequencia.controller");
const { AulasController } = require("./aulas.controller");
const { FrequenciasController } = require("./frequencias.controller");
const { FrequenciasService } = require("./frequencias.service");

class FrequenciasModule {}

Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [AulasController, FrequenciasController, AlunoFrequenciaController],
  providers: [FrequenciasService],
  exports: [FrequenciasService],
})(FrequenciasModule);

module.exports = { FrequenciasModule };
