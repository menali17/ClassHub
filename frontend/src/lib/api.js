const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("frequenta_token");
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("frequenta_token");
      window.location.href = "/login?sessao=expirada";
    }
    throw { status: 401, message: "Sessão expirada." };
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw { status: res.status, message: data.message || "Erro desconhecido" };
  return data;
}

// ── Auth ──────────────────────────────────────────────────────────────
// POST /api/auth/login → { token, expiraEm, usuario: { id, nome, email, matricula, perfil, fotoUrl } }
export const login = (email, senha) =>
  request("/auth/login", { method: "POST", body: JSON.stringify({ email, senha }) });

// GET /api/auth/me → { id, nome, email, matricula, perfil, fotoUrl }
export const getMe = () => request("/auth/me");

// POST /api/auth/logout → { message }
export const logout = () =>
  request("/auth/logout", { method: "POST" });

// GET /api → health check com contadores do banco
export const getApiHealth = () => request("");

// ── Dashboard ─────────────────────────────────────────────────────────
// GET /api/dashboard → { totalAlunos, totalAulas, taxaMediaPresenca, limiteBaixaFrequencia, alunosComBaixaFrequencia }
export const getDashboard = () => request("/dashboard");

// ── Turmas ────────────────────────────────────────────────────────────
// GET /api/turmas → [{ id, nome, codigo, horario, quantidadeAlunos }]
export const getTurmas = () => request("/turmas");

// POST /api/turmas → { nome, codigo, horario }
export const createTurma = (data) =>
  request("/turmas", { method: "POST", body: JSON.stringify(data) });

// GET /api/turmas/:id → { id, nome, codigo, horario, ... }
export const getTurma = (id) => request(`/turmas/${id}`);

// PATCH /api/turmas/:id → campos parciais da turma
export const updateTurma = (id, data) =>
  request(`/turmas/${id}`, { method: "PATCH", body: JSON.stringify(data) });

// DELETE /api/turmas/:id (apenas admin)
export const deleteTurma = (id) =>
  request(`/turmas/${id}`, { method: "DELETE" });

// GET /api/turmas/:id/alunos → { turma: {...}, quantidadeAlunos, alunos: [{ id, nome, email, matricula, fotoUrl }] }
export const getTurmaAlunos = (id) => request(`/turmas/${id}/alunos`);

// POST /api/turmas/:id/alunos → vincula aluno à turma
export const vincularAluno = (turmaId, alunoId) =>
  request(`/turmas/${turmaId}/alunos`, { method: "POST", body: JSON.stringify({ alunoId }) });

// ── Aulas e Frequência ────────────────────────────────────────────────
// GET /api/turmas/:turmaId/aulas → { turma, aulas: [{ id, turmaId, data, horario, status, frequenciasRegistradas? }] }
export const getTurmaAulas = (turmaId) => request(`/turmas/${turmaId}/aulas`);

// POST /api/turmas/:turmaId/aulas → { data, horario }
// Resposta: { id, turmaId, data, horario, status }
export const createAula = (turmaId, data) =>
  request(`/turmas/${turmaId}/aulas`, { method: "POST", body: JSON.stringify(data) });

// PUT /api/aulas/:aulaId/frequencias → { frequencias: [{ alunoId, situacao }] }
export const saveFrequencias = (aulaId, frequencias) =>
  request(`/aulas/${aulaId}/frequencias`, { method: "PUT", body: JSON.stringify({ frequencias }) });

// ── Alunos ────────────────────────────────────────────────────────────
// GET /api/alunos → lista de alunos
export const getAlunos = () => request("/alunos");

// POST /api/alunos → { nome, email, matricula, senha } (planejado — admin)
export const createAluno = (data) =>
  request("/alunos", { method: "POST", body: JSON.stringify(data) });

// GET /api/alunos/me/frequencia
// GET /api/alunos/:id/frequencia
// Resposta: { aluno, resumoGeral: { totalAulas, presencas, faltas, percentualPresenca, baixaFrequencia }, turmas: [...] }
export const getFrequenciaAluno = (alunoId) =>
  alunoId === "me"
    ? request("/alunos/me/frequencia")
    : request(`/alunos/${alunoId}/frequencia`);

// ── Professores ───────────────────────────────────────────────────────
// GET /api/professores → lista de professores (apenas admin)
export const getProfessores = () => request("/professores");

// POST /api/professores → { nome, email, senha } (planejado — admin)
export const createProfessor = (data) =>
  request("/professores", { method: "POST", body: JSON.stringify(data) });

// ── Perfil ────────────────────────────────────────────────────────────
export const updatePerfil = (data) =>
  request("/auth/me", { method: "PATCH", body: JSON.stringify(data) });

export const updateSenha = (data) =>
  request("/auth/senha", { method: "PATCH", body: JSON.stringify(data) });

export const getAuthToken = () => getToken();

export const API_BASE_URL = BASE;