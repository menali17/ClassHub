const { Controller, Get } = require("@nestjs/common");
const { AppService } = require("./app.service");

class AppController {
  constructor(appService) {
    this.appService = appService;
  }

  getHello() {
    return this.appService.getHello();
  }
}

Reflect.defineMetadata("design:paramtypes", [AppService], AppController);
Controller()(AppController);
Get()(AppController.prototype, "getHello", Object.getOwnPropertyDescriptor(AppController.prototype, "getHello"));

module.exports = { AppController };
