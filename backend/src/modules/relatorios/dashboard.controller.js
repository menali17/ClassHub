const { Controller, Get, Req, UseGuards } = require("@nestjs/common");
const { AuthGuard } = require("../auth/auth.guard");
const { RelatoriosService } = require("./relatorios.service");

class DashboardController {
  constructor(relatoriosService) {
    this.relatoriosService = relatoriosService;
  }

  getDashboard(request) {
    return this.relatoriosService.getDashboard(request.user);
  }
}

Reflect.defineMetadata("design:paramtypes", [RelatoriosService], DashboardController);
Controller("dashboard")(DashboardController);

Req()(DashboardController.prototype, "getDashboard", 0);
UseGuards(AuthGuard)(
  DashboardController.prototype,
  "getDashboard",
  Object.getOwnPropertyDescriptor(DashboardController.prototype, "getDashboard"),
);
Get()(DashboardController.prototype, "getDashboard", Object.getOwnPropertyDescriptor(DashboardController.prototype, "getDashboard"));

module.exports = { DashboardController };
