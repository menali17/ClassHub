const { Module } = require("@nestjs/common");
const { DatabaseModule } = require("../../database/database.module");
const { AuthModule } = require("../auth/auth.module");
const { FrequenciasModule } = require("../frequencias/frequencias.module");
const { DashboardController } = require("./dashboard.controller");
const { ExportacoesService } = require("./exportacoes.service");
const { RelatoriosController } = require("./relatorios.controller");
const { RelatoriosService } = require("./relatorios.service");

class RelatoriosModule {}

Module({
  imports: [DatabaseModule, AuthModule, FrequenciasModule],
  controllers: [DashboardController, RelatoriosController],
  providers: [RelatoriosService, ExportacoesService],
})(RelatoriosModule);

module.exports = { RelatoriosModule };
