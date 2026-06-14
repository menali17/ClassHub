# Arquitetura do Sistema

Este documento apresenta a organização técnica da plataforma de gestão de
frequência acadêmica e a responsabilidade de cada parte do projeto.

## Visão geral

O sistema segue uma arquitetura web dividida em três partes principais:

| Camada | Tecnologia | Responsabilidade |
|---|---|---|
| Interface | Next.js, React e Tailwind CSS | Exibir as telas e receber as ações dos usuários. |
| API | NestJS e API REST | Validar as requisições, aplicar as regras de negócio e controlar o acesso. |
| Persistência | SQLite | Armazenar usuários, sessões, turmas, aulas e frequências. |

O front-end não acessa o banco diretamente. Toda leitura ou alteração de dados
deve passar pela API, que verifica a autenticação e as permissões do usuário
antes de executar uma operação.

## Estrutura do repositório

| Diretório | Conteúdo |
|---|---|
| `frontend` | Aplicação web desenvolvida com Next.js. |
| `backend` | API REST desenvolvida com NestJS. |
| `backend/src/database` | Criação do banco SQLite e operações de persistência. |
| `backend/src/modules` | Módulos das funcionalidades do back-end. |
| `docs` | Documentação publicada com MkDocs. |
| `.github/workflows` | Automação de publicação da documentação. |

Essa separação permite que front-end, back-end e documentação sejam
desenvolvidos de forma independente, desde que os formatos definidos no
contrato da API sejam respeitados.

## Front-end

O front-end utiliza Next.js 15, React 19 e Tailwind CSS. Sua responsabilidade é:

- apresentar as telas adequadas para aluno, professor e administrador;
- coletar e validar os dados informados pelo usuário;
- enviar requisições HTTP para o back-end;
- apresentar carregamento, sucesso e erro das operações;
- armazenar e enviar o token da sessão enquanto o usuário estiver autenticado.

No estado atual do projeto, a estrutura do Next.js está configurada, mas a
integração das telas com a API ainda precisa ser implementada.

## Back-end

O back-end utiliza NestJS e está dividido por responsabilidade:

| Módulo | Responsabilidade |
|---|---|
| `auth` | Login, logout, identificação do usuário e validação das sessões. |
| `turmas` | Cadastro e consulta de turmas, professores e vínculos de alunos. |
| `frequencias` | Cadastro de aulas, registro da chamada e consulta dos históricos. |
| `database` | Esquema SQLite, dados iniciais e operações SQL. |

Os controllers recebem as requisições HTTP e encaminham os dados para os
services. Os services aplicam validações e regras de acesso. O
`DatabaseService` concentra as operações realizadas no SQLite.

## Fluxo de uma operação

Uma operação comum percorre as seguintes etapas:

1. O usuário executa uma ação na interface.
2. O front-end envia uma requisição para uma rota `/api`.
3. O `AuthGuard` valida o token nas rotas protegidas.
4. O controller encaminha os dados ao service responsável.
5. O service valida os dados e as permissões do perfil autenticado.
6. O `DatabaseService` consulta ou altera o banco SQLite.
7. A API devolve uma resposta JSON ao front-end.
8. A interface atualiza a tela ou informa o erro ao usuário.

## Autenticação e autorização

O sistema diferencia três perfis:

| Perfil | Responsabilidades principais |
|---|---|
| Aluno | Consultar a própria frequência. |
| Professor | Gerenciar as próprias turmas, registrar aulas e realizar chamadas. |
| Administrador | Consultar e gerenciar informações gerais permitidas pela API. |

Após o login, a API entrega um token aleatório. Somente o hash desse token é
armazenado no banco. Nas rotas protegidas, o front-end deve enviar o token no
cabeçalho `Authorization`.

As sessões possuem duração configurável e podem ser revogadas no logout. A
autorização não depende apenas das telas: o próprio back-end verifica o perfil
e o vínculo do usuário com a informação solicitada.

## Configuração dos ambientes

Durante o desenvolvimento, cada parte é executada separadamente:

| Serviço | Endereço padrão |
|---|---|
| Front-end | `http://localhost:3000` |
| Back-end | `http://localhost:3333/api` |
| Documentação | endereço definido ao executar o MkDocs |

O back-end aceita requisições da origem definida em `FRONTEND_URL`. O caminho
do banco, o limite de baixa frequência e a duração das sessões também são
configurados por variáveis de ambiente.

## Decisões adotadas

- Uso de API REST para separar a interface das regras de negócio.
- Uso de SQLite para simplificar a execução e a demonstração do desafio.
- Organização do back-end por módulos funcionais.
- Autenticação por token persistido como hash.
- Controle de acesso aplicado no servidor conforme o perfil autenticado.
- Contrato da API documentado para orientar a integração entre as equipes.

## Documentos relacionados

- [Banco de Dados](banco_de_dados.md)
- [Integração Front-end e Back-end](integracao_front_back.md)
- [Contrato da API no GitHub](https://github.com/menali17/Desafio_4_Trainee_EngNet/blob/developer/backend/CONTRATO_API.md)

## Histórico de Versão

| Versão | Data | Descrição | Autor(es) |
|---|---|---|---|
| 1.0 | 14/06/2026 | Criação da documentação da arquitetura atual do sistema. | Enzo Menali |
