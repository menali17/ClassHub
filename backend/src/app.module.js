const { Module } = require("@nestjs/common");
const { AppController } = require("./app.controller");
const { AppService } = require("./app.service");

class AppModule {}

Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})(AppModule);

module.exports = { AppModule };
