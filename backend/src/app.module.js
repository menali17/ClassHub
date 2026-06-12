const { Module } = require("@nestjs/common");
const { AppController } = require("./app.controller");
const { AppService } = require("./app.service");
const { DatabaseModule } = require("./database/database.module");
const { AuthModule } = require("./modules/auth/auth.module");

class AppModule {}

Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})(AppModule);

module.exports = { AppModule };
