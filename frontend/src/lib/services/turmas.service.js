/**
 * Camada de serviço — preparada para extensão futura.
 * Encapsula chamadas de turmas sobre lib/api.js.
 */
export {
  getTurmas,
  createTurma,
  getTurma,
  updateTurma,
  deleteTurma,
  getTurmaAlunos,
  vincularAluno,
  getTurmaAulas,
} from "@/lib/api";
