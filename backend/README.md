# Back-end

Esta pasta contem a API do sistema, feita com NestJS.

## Como rodar

Use Node.js 22.5 ou superior, pois o projeto utiliza o suporte nativo ao SQLite.

Abra um terminal nesta pasta:

```bash
cd backend
npm install
copy .env.example .env
npm run start:dev
```

Depois acesse o teste da API:

```text
http://localhost:3333/api
```

Na primeira execução, o sistema cria automaticamente o banco em
`data/engnet.sqlite` e adiciona dados iniciais para desenvolvimento.

## Dados iniciais

Os usuários abaixo são criados com a senha `123456`:

| Perfil | E-mail |
|---|---|
| Administrador | `admin@engnet.com` |
| Professor | `professor@engnet.com` |
| Alunos | `aluno01@engnet.com` até `aluno10@engnet.com` |

Também são criadas duas turmas, com cinco alunos vinculados a cada uma.

O limite de baixa frequência é configurado por
`LOW_ATTENDANCE_THRESHOLD` e possui o valor padrão de `75`.

## Autenticação

As seguintes rotas estão disponíveis:

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/auth/login` | Recebe e-mail e senha e retorna o token da sessão. |
| `GET` | `/api/auth/me` | Retorna o usuário autenticado. |
| `POST` | `/api/auth/logout` | Encerra a sessão e invalida o token. |

As rotas protegidas recebem o token no cabeçalho:

```text
Authorization: Bearer <token>
```

A duração da sessão pode ser alterada por `AUTH_TOKEN_EXPIRATION_HOURS`.

## Turmas e alunos

As rotas abaixo exigem autenticação:

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| `GET` | `/api/turmas` | Professor e administrador | Lista as turmas disponíveis para o usuário. |
| `POST` | `/api/turmas` | Professor e administrador | Cria uma turma. |
| `GET` | `/api/turmas/:id` | Professor responsável e administrador | Consulta uma turma. |
| `PATCH` | `/api/turmas/:id` | Professor responsável e administrador | Edita uma turma. |
| `GET` | `/api/turmas/:id/alunos` | Professor responsável e administrador | Lista os alunos da turma. |
| `POST` | `/api/turmas/:id/alunos` | Professor responsável e administrador | Vincula um aluno à turma. |
| `GET` | `/api/alunos` | Professor e administrador | Lista os alunos cadastrados. |
| `GET` | `/api/professores` | Administrador | Lista professores para atribuição de turma. |

O professor visualiza e altera somente suas próprias turmas. O administrador possui acesso a todas as turmas.

## Onde mexer

```text
src/main.js           # inicia a API
src/app.module.js     # registra controllers e services
src/app.controller.js # recebe a requisicao HTTP inicial
src/app.service.js    # guarda a regra inicial
src/database          # cria e acessa o banco SQLite
```

## Proximo passo

Quando começarmos as funcionalidades, criem modulos seguindo o padrao do Nest:

```text
src/modules/turmas
src/modules/alunos
src/modules/aulas
src/modules/frequencias
src/modules/relatorios
```

Cada modulo pode ter `controller`, `service`, `module` e `dto`.

## Integração com o front-end

Os formatos combinados para as rotas atuais e planejadas estão descritos em
[CONTRATO_API.md](CONTRATO_API.md). O front-end pode usar esses exemplos como
dados simulados até cada rota ser implementada.
