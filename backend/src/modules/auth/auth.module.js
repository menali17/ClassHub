const { Module } = require("@nestjs/common");
const { DatabaseModule } = require("../../database/database.module");
const { AuthController } = require("./auth.controller");
const { AuthGuard } = require("./auth.guard");
const { AuthService } = require("./auth.service");

class AuthModule {}

Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
})(AuthModule);

module.exports = { AuthModule };
