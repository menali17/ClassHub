# Arquitetura do Sistema

Este documento apresenta a arquitetura atual do ClassHub, a responsabilidade de cada camada e as principais decisões técnicas utilizadas na implementação.

## Visão geral

O ClassHub segue uma arquitetura web cliente-servidor dividida em três camadas:

| Camada | Tecnologia | Responsabilidade |
|---|---|---|
| Interface | Next.js 15, React 19, JavaScript e Tailwind CSS | Renderizar as telas, controlar a sessão no navegador e consumir a API. |
| API | NestJS 10 e API REST | Autenticar usuários, validar permissões e aplicar as regras de negócio. |
| Persistência | SQLite com `node:sqlite` | Armazenar usuários, sessões, turmas, vínculos, aulas e frequências. |

O front-end nunca acessa o banco diretamente. Toda consulta ou alteração passa pela API, que valida o token e as permissões do perfil autenticado.

## Estrutura do repositório

| Diretório | Conteúdo |
|---|---|
| `frontend/src/app` | Páginas e rotas da interface. |
| `frontend/src/components` | Componentes visuais compartilhados. |
| `frontend/src/contexts` | Estado global de autenticação e tema. |
| `frontend/src/lib/api.js` | Cliente centralizado para consumo da API. |
| `backend/src/modules` | Módulos funcionais do back-end. |
| `backend/src/database` | Esquema SQLite, carga inicial e operações de persistência. |
| `backend/test` | Testes de integração da API. |
| `docs` | Documentação publicada com MkDocs. |
| `.github/workflows` | Automação da publicação da documentação. |

## Front-end

O front-end está integrado à API e possui fluxos específicos para os três perfis. Suas responsabilidades incluem:

- apresentar menus e ações compatíveis com o perfil autenticado;
- validar os dados dos formulários antes do envio;
- enviar o token de sessão nas requisições protegidas;
- apresentar estados de carregamento, sucesso, vazio e erro;
- exibir dashboards, gráficos, históricos e relatórios;
- persistir a preferência entre tema claro e escuro no navegador.

As páginas protegidas ficam abaixo de `frontend/src/app/dashboard`. O `AuthContext` restaura e encerra a sessão, enquanto `frontend/src/lib/api.js` concentra as chamadas HTTP.

## Back-end

O back-end é organizado por módulos funcionais:

| Módulo | Responsabilidade |
|---|---|
| `auth` | Login, identificação do usuário, logout e validação das sessões. |
| `usuarios` | Perfil e administração de alunos e professores. |
| `turmas` | Turmas, professor responsável e vínculos de alunos. |
| `frequencias` | Aulas, chamadas e históricos de frequência. |
| `relatorios` | Dashboard, relatórios e exportações em PDF e XLSX. |
| `database` | Esquema, migrações simples, carga inicial e operações SQL. |

Os controllers recebem as requisições HTTP. Os services validam dados, perfis e vínculos antes de utilizar o `DatabaseService`.

## Perfis e permissões

| Perfil | Permissões principais |
|---|---|
| Aluno | Consultar somente suas turmas, sua frequência e seu histórico. |
| Professor | Consultar as próprias turmas, gerenciar seus vínculos de alunos, registrar chamadas e acessar relatórios relacionados às suas turmas. |
| Administrador | Gerenciar alunos, professores e turmas, definir professores responsáveis, acompanhar indicadores gerais e exportar relatórios. |

Somente o administrador pode criar, editar ou remover turmas. Somente o professor responsável pode criar aulas e registrar ou corrigir chamadas. As permissões são verificadas pelo back-end, mesmo quando uma ação também está oculta na interface.

## Fluxo de uma operação

1. O usuário realiza uma ação na interface.
2. O front-end envia uma requisição para a API usando a URL configurada.
3. O `AuthGuard` valida o token nas rotas protegidas.
4. O controller encaminha os dados ao service responsável.
5. O service valida o conteúdo, o perfil e o vínculo do usuário.
6. O `DatabaseService` consulta ou altera o SQLite.
7. A API devolve uma resposta JSON ou um arquivo de relatório.
8. A interface atualiza a tela ou apresenta uma mensagem ao usuário.

## Autenticação

Após o login, a API gera um token aleatório e persiste somente seu hash. O front-end armazena o token no navegador e o envia no cabeçalho:

```text
Authorization: Bearer <token>
```

As sessões possuem duração configurável. O logout revoga a sessão no banco e remove o token do navegador. Usuários desativados não podem iniciar novas sessões.

## Configuração e execução

| Serviço | Endereço local padrão | Configuração principal |
|---|---|---|
| Front-end | `http://localhost:3000` | `NEXT_PUBLIC_API_URL` |
| Back-end | `http://localhost:3333/api` | `PORT`, `FRONTEND_URL` e `DATABASE_PATH` |
| Documentação | `http://127.0.0.1:8000` | `mkdocs.yml` |

O limite de baixa frequência é definido por `LOW_ATTENDANCE_THRESHOLD` e possui valor padrão de 75%. O front-end será publicado na Vercel e consumirá uma URL pública da API. Como o back-end utiliza um arquivo SQLite, ele deve ser executado em ambiente Node.js com armazenamento persistente. A documentação continua publicada no GitHub Pages.

## Decisões adotadas

- API REST para separar interface, regras de negócio e persistência.
- JavaScript em todo o projeto para manter uma stack uniforme.
- SQLite para simplificar a instalação e a demonstração do desafio.
- Autenticação por token persistido somente como hash.
- Controle de acesso aplicado no servidor conforme perfil e vínculo.
- Componentes compartilhados e cliente HTTP centralizado no front-end.
- Testes de integração para os principais fluxos do back-end.

## Documentos relacionados

- [Banco de Dados](banco_de_dados.md)
- [Integração entre Front-end e Back-end](integracao_front_back.md)
- [Contrato da API no GitHub](https://github.com/menali17/ClassHub/blob/main/backend/CONTRATO_API.md)

## Histórico de Versão

| Versão | Data | Descrição | Autor(es) |
|---|---|---|---|
| 1.0 | 14/06/2026 | Criação da documentação da arquitetura inicial do sistema. | Enzo Menali |
| 2.0 | 15/06/2026 | Atualização da arquitetura conforme a integração e as permissões implementadas. | Enzo Menali |
| 2.1 | 15/06/2026 | Esclarecimento da arquitetura de publicação do front-end, API e banco SQLite. | Enzo Menali |
