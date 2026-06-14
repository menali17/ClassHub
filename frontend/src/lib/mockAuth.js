// Usuários mock para testar sem backend
export const MOCK_USERS = [
  {
    id: 1,
    nome: "Admin EngNet",
    email: "admin@engnet.com",
    senha: "123456",
    perfil: "admin",
    fotoUrl: null,
  },
  {
    id: 2,
    nome: "Professor Teste",
    email: "professor@engnet.com",
    senha: "123456",
    perfil: "professor",
    fotoUrl: null,
  },
  ...Array.from({ length: 10 }, (_, i) => ({
    id: 10 + i + 1,
    nome: `Aluno ${String(i + 1).padStart(2, "0")}`,
    email: `aluno${String(i + 1).padStart(2, "0")}@engnet.com`,
    senha: "123456",
    perfil: "aluno",
    fotoUrl: null,
  })),
];

export function mockLogin(email, senha) {
  const user = MOCK_USERS.find(
    (u) => u.email === email && u.senha === senha
  );
  if (!user) throw { status: 401, message: "E-mail ou senha incorretos." };
  const { senha: _, ...usuario } = user;
  return { token: `mock-token-${usuario.id}`, usuario };
}

export function mockGetMe(token) {
  const id = parseInt(token?.replace("mock-token-", ""));
  const user = MOCK_USERS.find((u) => u.id === id);
  if (!user) throw { status: 401, message: "Token inválido." };
  const { senha: _, ...usuario } = user;
  return usuario;
}
