/** Normaliza o perfil retornado pelo backend para o padrão interno do frontend. */
export function normalizePerfil(perfil) {
  if (!perfil) return "aluno";
  const raw =
    typeof perfil === "object"
      ? perfil?.nome || perfil?.id || "aluno"
      : String(perfil).toLowerCase();
  if (raw === "administrador" || raw === "admin") return "admin";
  if (raw === "professor") return "professor";
  return "aluno";
}

export function isAdmin(userOrPerfil) {
  const perfil = typeof userOrPerfil === "string" ? userOrPerfil : userOrPerfil?.perfil;
  return normalizePerfil(perfil) === "admin";
}

export function isProfessor(userOrPerfil) {
  const perfil = typeof userOrPerfil === "string" ? userOrPerfil : userOrPerfil?.perfil;
  return normalizePerfil(perfil) === "professor";
}

export function isAluno(userOrPerfil) {
  const perfil = typeof userOrPerfil === "string" ? userOrPerfil : userOrPerfil?.perfil;
  return normalizePerfil(perfil) === "aluno";
}

export function isProfessorOrAdmin(userOrPerfil) {
  return isProfessor(userOrPerfil) || isAdmin(userOrPerfil);
}

export const PERFIL_LABELS = {
  admin: "Administrador",
  professor: "Professor",
  aluno: "Aluno",
};

export function getPerfilLabel(perfil) {
  return PERFIL_LABELS[normalizePerfil(perfil)] || perfil;
}
