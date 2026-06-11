const { Injectable } = require("@nestjs/common");
const { DatabaseService } = require("./database/database.service");

class AppService {
  constructor(databaseService) {
    this.databaseService = databaseService;
  }

  getHello() {
    return {
      message: "Back-end NestJS iniciado",
      database: {
        status: "conectado",
        registros: this.databaseService.getSummary(),
      },
    };
  }
}

Reflect.defineMetadata("design:paramtypes", [DatabaseService], AppService);
Injectable()(AppService);

module.exports = { AppService };
