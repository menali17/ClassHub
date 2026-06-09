const { Injectable } = require("@nestjs/common");

class AppService {
  getHello() {
    return {
      message: "Back-end NestJS iniciado",
    };
  }
}

Injectable()(AppService);

module.exports = { AppService };
