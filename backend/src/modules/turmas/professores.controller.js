const { Controller, Get, Req, UseGuards } = require("@nestjs/common");
const { AuthGuard } = require("../auth/auth.guard");
const { TurmasService } = require("./turmas.service");

class ProfessoresController {
  constructor(turmasService) {
    this.turmasService = turmasService;
  }

  listProfessors(request) {
    return this.turmasService.listProfessors(request.user);
  }
}

Reflect.defineMetadata("design:paramtypes", [TurmasService], ProfessoresController);
Controller("professores")(ProfessoresController);

Req()(ProfessoresController.prototype, "listProfessors", 0);
UseGuards(AuthGuard)(
  ProfessoresController.prototype,
  "listProfessors",
  Object.getOwnPropertyDescriptor(ProfessoresController.prototype, "listProfessors"),
);
Get()(
  ProfessoresController.prototype,
  "listProfessors",
  Object.getOwnPropertyDescriptor(ProfessoresController.prototype, "listProfessors"),
);

module.exports = { ProfessoresController };
