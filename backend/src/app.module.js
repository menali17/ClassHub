const { Module } = require("@nestjs/common");
const { AppController } = require("./app.controller");
const { AppService } = require("./app.service");
const { DatabaseModule } = require("./database/database.module");

class AppModule {}

Module({
  imports: [DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})(AppModule);

module.exports = { AppModule };
