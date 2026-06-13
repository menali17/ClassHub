const { Controller, Get, Req, UseGuards } = require("@nestjs/common");
const { AuthGuard } = require("../auth/auth.guard");
const { TurmasService } = require("./turmas.service");

class AlunosController {
  constructor(turmasService) {
    this.turmasService = turmasService;
  }

  listStudents(request) {
    return this.turmasService.listStudents(request.user);
  }
}

Reflect.defineMetadata("design:paramtypes", [TurmasService], AlunosController);
Controller("alunos")(AlunosController);

Req()(AlunosController.prototype, "listStudents", 0);
UseGuards(AuthGuard)(
  AlunosController.prototype,
  "listStudents",
  Object.getOwnPropertyDescriptor(AlunosController.prototype, "listStudents"),
);
Get()(AlunosController.prototype, "listStudents", Object.getOwnPropertyDescriptor(AlunosController.prototype, "listStudents"));

module.exports = { AlunosController };
