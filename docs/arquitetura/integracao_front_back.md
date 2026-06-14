# Integração entre Front-end e Back-end

Este documento define como a aplicação Next.js deve se comunicar com a API
NestJS. O objetivo é manter os formatos das requisições previsíveis e evitar
diferenças entre o que a interface envia e o que o back-end espera receber.

## Situação atual

O back-end já disponibiliza rotas para autenticação, perfil, administração de
usuários, turmas, aulas, frequências, dashboard e relatórios. O front-end está
configurado com Next.js, mas ainda precisa conectar suas telas a essas rotas.

O arquivo `backend/CONTRATO_API.md` é a referência principal dos corpos das
requisições e respostas. Quando uma rota for alterada, o contrato também deve
ser atualizado.

## Endereços locais

| Aplicação | Endereço padrão |
|---|---|
| Front-end | `http://localhost:3000` |
| API | `http://localhost:3333/api` |

No back-end, a variável `FRONTEND_URL` define qual origem pode acessar a API
por meio do CORS:

```env
FRONTEND_URL=http://localhost:3000
```

Para o front-end, recomenda-se configurar o endereço da API em uma variável
pública de ambiente:

```env
NEXT_PUBLIC_API_URL=http://localhost:3333/api
```

Essa variável ainda precisa ser adicionada quando a integração for iniciada.

## Formato da comunicação

As aplicações se comunicam por HTTP e trocam dados em JSON. Requisições que
enviam conteúdo devem informar:

```text
Content-Type: application/json
```

As rotas protegidas também exigem:

```text
Authorization: Bearer <token>
```

## Fluxo de autenticação

1. O usuário informa e-mail e senha no front-end.
2. O front-end envia `POST /api/auth/login`.
3. A API valida as credenciais e retorna o usuário e o token da sessão.
4. O front-end mantém o token durante a sessão.
5. As próximas requisições protegidas enviam o token como `Bearer`.
6. No logout, o front-end envia `POST /api/auth/logout`.
7. A API revoga a sessão e o front-end remove o token local.

Exemplo de login:

```javascript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ email, senha }),
});

const data = await response.json();
```

Exemplo de rota protegida:

```javascript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/turmas`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

## Rotas disponíveis

### Autenticação

| Método | Rota | Finalidade |
|---|---|---|
| `POST` | `/auth/login` | Iniciar a sessão. |
| `GET` | `/auth/me` | Consultar o usuário autenticado. |
| `POST` | `/auth/logout` | Encerrar a sessão. |

### Turmas e usuários

| Método | Rota | Finalidade |
|---|---|---|
| `GET` | `/turmas` | Listar as turmas permitidas para o usuário. |
| `POST` | `/turmas` | Criar uma turma. |
| `GET` | `/turmas/:id` | Consultar uma turma. |
| `PATCH` | `/turmas/:id` | Editar uma turma. |
| `DELETE` | `/turmas/:id` | Remover uma turma como administrador. |
| `GET` | `/turmas/:id/alunos` | Listar os alunos da turma. |
| `POST` | `/turmas/:id/alunos` | Vincular um aluno à turma. |
| `DELETE` | `/turmas/:id/alunos/:alunoId` | Desvincular um aluno da turma. |
| `GET` | `/alunos` | Listar alunos cadastrados. |
| `GET` | `/professores` | Listar professores. |

### Perfil e administração

| Método | Rota | Finalidade |
|---|---|---|
| `GET` | `/perfil` | Consultar o próprio perfil. |
| `PATCH` | `/perfil` | Atualizar o próprio perfil. |
| `PATCH` | `/perfil/senha` | Alterar a própria senha. |
| `POST` | `/alunos` | Cadastrar aluno como administrador. |
| `GET/PATCH/DELETE` | `/alunos/:id` | Consultar, editar ou desativar aluno. |
| `POST` | `/professores` | Cadastrar professor como administrador. |
| `GET/PATCH/DELETE` | `/professores/:id` | Consultar, editar ou desativar professor. |

### Aulas e frequências

| Método | Rota | Finalidade |
|---|---|---|
| `POST` | `/turmas/:turmaId/aulas` | Criar uma aula. |
| `GET` | `/turmas/:turmaId/aulas` | Listar as aulas da turma. |
| `PUT` | `/aulas/:aulaId/frequencias` | Registrar ou corrigir a chamada completa. |
| `GET` | `/alunos/:alunoId/frequencia` | Consultar a frequência de um aluno autorizado. |
| `GET` | `/alunos/me/frequencia` | Consultar a frequência do aluno autenticado. |

### Dashboard e relatórios

| Método | Rota | Finalidade |
|---|---|---|
| `GET` | `/dashboard` | Consultar totais e alertas de baixa frequência. |
| `GET` | `/relatorios/alunos/:alunoId` | Consultar relatório individual. |
| `GET` | `/relatorios/alunos-baixa-frequencia` | Consultar alunos abaixo de 75%. |
| `GET` | `/relatorios/turmas/:turmaId` | Consultar relatório de uma turma. |
| `GET` | `/relatorios/.../exportar?formato=pdf` | Baixar relatório em PDF ou XLSX. |

Os exemplos completos dos corpos e respostas estão no contrato da API.

## Organização recomendada no front-end

Para evitar requisições espalhadas pelas páginas, a integração pode ser
centralizada em uma camada própria:

```text
frontend/src/
├── app/
├── components/
├── services/
│   ├── api.js
│   ├── auth.js
│   ├── usuarios.js
│   ├── turmas.js
│   ├── frequencias.js
│   └── relatorios.js
└── contexts/
    └── auth-context.jsx
```

Essa estrutura ainda não foi criada. Ela representa o padrão recomendado para
a implementação: `api.js` concentra a URL, os cabeçalhos e o tratamento básico
das respostas; os demais arquivos agrupam as chamadas de cada funcionalidade.

## Tratamento de respostas

O front-end deve verificar `response.ok` antes de considerar uma operação bem-
sucedida. Os principais códigos esperados são:

| Código | Significado | Comportamento esperado na interface |
|---:|---|---|
| `200` | Consulta ou alteração concluída. | Atualizar a tela e informar sucesso quando necessário. |
| `201` | Registro criado. | Exibir o novo item ou retornar à listagem. |
| `400` | Dados inválidos ou incompletos. | Mostrar a mensagem próxima ao formulário. |
| `401` | Sessão ausente, inválida ou expirada. | Limpar a sessão e retornar ao login. |
| `403` | Usuário sem permissão. | Informar que a ação não está disponível. |
| `404` | Registro não encontrado. | Informar que o conteúdo não existe. |
| `409` | Conflito ou dado duplicado. | Apresentar a mensagem devolvida pela API. |
| `500` | Erro interno. | Informar falha temporária sem expor detalhes técnicos. |

Durante uma requisição, botões de envio devem permanecer desabilitados para
evitar ações repetidas. A interface também deve apresentar estados de
carregamento e mensagens de erro retornadas pela API.

## Regras importantes para a integração

- O front-end nunca deve acessar o arquivo SQLite diretamente.
- As permissões exibidas na interface devem acompanhar o perfil autenticado.
- O back-end continua responsável pela validação definitiva das permissões.
- Datas de aula devem usar o formato `AAAA-MM-DD`.
- Horários devem usar o formato `HH:mm`.
- A situação da frequência aceita apenas `presente` ou `falta`.
- A chamada deve enviar todos os alunos vinculados à turma.
- Uma frequência abaixo de `75%` deve ser apresentada como baixa frequência.
- Alterações nas respostas da API devem ser registradas no contrato antes da
  atualização do front-end.

## Sequência recomendada de implementação

1. Configurar `NEXT_PUBLIC_API_URL`.
2. Criar o cliente HTTP compartilhado.
3. Integrar login, consulta da sessão e logout.
4. Integrar listagem de turmas e alunos.
5. Integrar as telas administrativas de alunos e professores.
6. Integrar criação de aulas e registro da chamada.
7. Integrar dashboard, relatórios e downloads.
8. Integrar a consulta de frequência do aluno.
9. Validar os três perfis e os estados de erro.

## Documentos relacionados

- [Arquitetura do Sistema](arquitetura_sistema.md)
- [Banco de Dados](banco_de_dados.md)
- [Contrato da API no GitHub](https://github.com/menali17/Desafio_4_Trainee_EngNet/blob/developer/backend/CONTRATO_API.md)

## Histórico de Versão

| Versão | Data | Descrição | Autor(es) |
|---|---|---|---|
| 1.0 | 14/06/2026 | Definição do padrão de integração entre Next.js e a API NestJS. | Enzo Menali |
| 1.1 | 14/06/2026 | Inclusão das rotas administrativas, perfil, dashboard e exportação de relatórios. | Enzo Menali |
