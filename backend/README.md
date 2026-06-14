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

## Perfil e administração de usuários

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| `GET` | `/api/perfil` | Usuário autenticado | Consulta o próprio perfil. |
| `PATCH` | `/api/perfil` | Usuário autenticado | Atualiza os próprios dados. |
| `PATCH` | `/api/perfil/senha` | Usuário autenticado | Altera a própria senha. |
| `POST` | `/api/alunos` | Administrador | Cadastra um aluno. |
| `GET` | `/api/alunos/:id` | Administrador | Consulta os dados e turmas de um aluno. |
| `PATCH` | `/api/alunos/:id` | Administrador | Edita um aluno. |
| `DELETE` | `/api/alunos/:id` | Administrador | Desativa um aluno. |
| `POST` | `/api/professores` | Administrador | Cadastra um professor. |
| `GET` | `/api/professores/:id` | Administrador | Consulta os dados e turmas de um professor. |
| `PATCH` | `/api/professores/:id` | Administrador | Edita um professor. |
| `DELETE` | `/api/professores/:id` | Administrador | Desativa um professor sem turmas atribuídas. |

As rotas `POST /api/alunos/:id/redefinir-senha` e
`POST /api/professores/:id/redefinir-senha` permitem ao administrador definir
uma nova senha. A desativação revoga as sessões abertas e impede novos logins.

## Turmas e alunos

As rotas abaixo exigem autenticação:

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| `GET` | `/api/turmas` | Professor e administrador | Lista as turmas disponíveis para o usuário. |
| `POST` | `/api/turmas` | Professor e administrador | Cria uma turma. |
| `GET` | `/api/turmas/:id` | Professor responsável e administrador | Consulta uma turma. |
| `PATCH` | `/api/turmas/:id` | Professor responsável e administrador | Edita uma turma. |
| `DELETE` | `/api/turmas/:id` | Administrador | Remove a turma e seus registros relacionados. |
| `GET` | `/api/turmas/:id/alunos` | Professor responsável e administrador | Lista os alunos da turma. |
| `POST` | `/api/turmas/:id/alunos` | Professor responsável e administrador | Vincula um aluno à turma. |
| `DELETE` | `/api/turmas/:id/alunos/:alunoId` | Professor responsável e administrador | Desvincula um aluno da turma. |
| `GET` | `/api/alunos` | Professor e administrador | Lista os alunos cadastrados. |
| `GET` | `/api/professores` | Administrador | Lista professores para atribuição de turma. |

O professor visualiza e altera somente suas próprias turmas. O administrador possui acesso a todas as turmas.

## Aulas e frequência

As rotas abaixo exigem autenticação:

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| `POST` | `/api/turmas/:turmaId/aulas` | Professor responsável | Cria uma aula com data e horário. |
| `GET` | `/api/turmas/:turmaId/aulas` | Professor responsável e administrador | Lista as aulas da turma. |
| `PUT` | `/api/aulas/:aulaId/frequencias` | Professor responsável | Registra ou corrige a chamada completa. |
| `GET` | `/api/alunos/:alunoId/frequencia` | Professor responsável e administrador | Consulta o histórico e os percentuais do aluno. |
| `GET` | `/api/alunos/me/frequencia` | Aluno | Consulta apenas a própria frequência. |

A chamada deve conter todos os alunos vinculados à turma, marcados como
`presente` ou `falta`. O reenvio atualiza a chamada sem duplicar registros.
Somente percentuais abaixo de `75%` são classificados como baixa frequência.

## Dashboard e relatórios

As rotas abaixo exigem autenticação de professor ou administrador:

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/dashboard` | Retorna totais, taxa média de presença e alertas de baixa frequência. |
| `GET` | `/api/relatorios/alunos/:alunoId` | Gera o relatório individual do aluno. |
| `GET` | `/api/relatorios/alunos-baixa-frequencia` | Lista alunos abaixo do limite de frequência. |
| `GET` | `/api/relatorios/alunos-baixa-frequencia?turmaId=:id` | Filtra os alunos por turma. |
| `GET` | `/api/relatorios/turmas/:turmaId` | Gera o histórico completo da turma. |
| `GET` | `/api/relatorios/alunos/:alunoId/exportar?formato=pdf` | Baixa o relatório individual em PDF ou XLSX. |
| `GET` | `/api/relatorios/alunos-baixa-frequencia/exportar?formato=xlsx` | Baixa a relação de baixa frequência em PDF ou XLSX. |
| `GET` | `/api/relatorios/turmas/:turmaId/exportar?formato=pdf` | Baixa o relatório da turma em PDF ou XLSX. |

Os indicadores do professor consideram apenas suas turmas. Os relatórios são
gerados em JSON para consumo pelo front-end e também podem ser baixados nos
formatos `pdf` e `xlsx`. Os cálculos incluem somente aulas com chamada finalizada.

## Onde mexer

```text
src/main.js           # inicia a API
src/app.module.js     # registra controllers e services
src/app.controller.js # recebe a requisicao HTTP inicial
src/app.service.js    # guarda a regra inicial
src/database          # cria e acessa o banco SQLite
src/modules/auth      # autenticacao e sessoes
src/modules/usuarios  # perfil e administracao de alunos e professores
src/modules/turmas    # turmas e vinculo de alunos
src/modules/frequencias # aulas, chamadas e historicos
src/modules/relatorios # dashboard e relatorios academicos
```

## Próximo passo

Integrar as rotas disponíveis com as telas do front-end.

## Integração com o front-end

Os formatos das rotas implementadas estão descritos em
[CONTRATO_API.md](CONTRATO_API.md).
