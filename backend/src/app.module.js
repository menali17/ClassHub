const { Module } = require("@nestjs/common");
const { AppController } = require("./app.controller");
const { AppService } = require("./app.service");
const { DatabaseModule } = require("./database/database.module");
const { AuthModule } = require("./modules/auth/auth.module");
const { FrequenciasModule } = require("./modules/frequencias/frequencias.module");
const { TurmasModule } = require("./modules/turmas/turmas.module");

class AppModule {}

Module({
  imports: [DatabaseModule, AuthModule, TurmasModule, FrequenciasModule],
  controllers: [AppController],
  providers: [AppService],
})(AppModule);

module.exports = { AppModule };
