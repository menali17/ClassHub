# ClassHub

Sistema web de gestão de presença acadêmica desenvolvido pela equipe **Moranguetes** durante o Desafio 4 do Programa Trainee da EngNet.

O ClassHub centraliza o cadastro de usuários e turmas, o registro de chamadas e o acompanhamento da frequência. A plataforma possui fluxos específicos para administradores, professores e alunos, além de dashboards e relatórios exportáveis em PDF e Excel.

## Sobre o projeto

O projeto busca substituir controles manuais de presença, reduzindo erros de registro e o tempo gasto na organização de chamadas e relatórios. Os dados ficam concentrados em uma única aplicação, permitindo que a instituição acompanhe rapidamente alunos com frequência abaixo do limite definido.

Por padrão, uma frequência inferior a **75%** é considerada baixa. Esse valor pode ser configurado no back-end.

## Perfis de acesso

| Perfil | Principais permissões |
|---|---|
| **Administrador** | Gerencia alunos, professores e turmas; vincula alunos; acompanha indicadores e exporta relatórios. |
| **Professor** | Consulta suas turmas, registra e corrige chamadas, acompanha frequências e gera relatórios das turmas sob sua responsabilidade. |
| **Aluno** | Consulta as próprias turmas, o histórico de chamadas e seu percentual de frequência. |

## Funcionalidades

- Autenticação e controle de acesso por perfil.
- Edição do próprio perfil e alteração de senha.
- Cadastro, edição, desativação e redefinição de senha de alunos e professores.
- Criação, edição e remoção de turmas pelo administrador.
- Atribuição de professores e vinculação de alunos às turmas.
- Registro e correção de chamadas pelo professor responsável.
- Consulta do histórico e do percentual de frequência.
- Dashboard com indicadores, gráficos e alertas de baixa frequência.
- Relatórios individuais, por turma e de alunos com baixa frequência.
- Exportação de relatórios em PDF e XLSX.
- Busca de alunos, professores e turmas.
- Interface responsiva com temas claro e escuro.

## Tecnologias

| Camada | Tecnologias |
|---|---|
| Front-end | Next.js 15, React 19, JavaScript, Tailwind CSS e Recharts |
| Back-end | NestJS 10 e API REST |
| Banco de dados | SQLite com `node:sqlite` |
| Relatórios | PDFKit e ExcelJS |
| Documentação | MkDocs Material |
| Versionamento | Git e GitHub |

## Estrutura do repositório

```text
ClassHub/
|-- backend/        # API, regras de negócio, banco e testes de integração
|-- frontend/       # Interface web em Next.js
|-- docs/           # Documentação do produto e do projeto
|-- mkdocs.yml      # Configuração do MkDocs
|-- package.json    # Scripts para executar e verificar o projeto
`-- README.md
```

## Como executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) 22.5 ou superior.
- npm, incluído na instalação do Node.js.
- Git para clonar o repositório.

### 1. Clonar o repositório

```bash
git clone https://github.com/menali17/ClassHub.git
cd ClassHub
```

### 2. Instalar as dependências

Execute os comandos na raiz do projeto:

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

### 3. Configurar o ambiente

No Windows PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env.local
```

No Linux ou macOS:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Configuração padrão do back-end:

| Variável | Valor padrão | Finalidade |
|---|---|---|
| `PORT` | `3333` | Porta da API. |
| `FRONTEND_URL` | `http://localhost:3000` | Origem autorizada pelo CORS. |
| `DATABASE_PATH` | `./data/engnet.sqlite` | Caminho do banco SQLite. |
| `LOW_ATTENDANCE_THRESHOLD` | `75` | Limite percentual de baixa frequência. |
| `AUTH_TOKEN_EXPIRATION_HOURS` | `8` | Duração da sessão em horas. |

O front-end utiliza `NEXT_PUBLIC_API_URL=http://localhost:3333/api` para acessar a API.

Variáveis adicionais usadas em produção:

| Variável | Exemplo | Finalidade |
|---|---|---|
| `AUTH_TOKEN_SECRET` | `classhub-token-secret-...` | Segredo usado para assinar os tokens de autenticação em ambiente serverless. |
| `SEED_DEMO_ATTENDANCE` | `true` | Opcional. Força a criação de aulas e frequências demonstrativas quando o banco estiver vazio. |

### 4. Iniciar a aplicação

Na raiz do projeto:

```bash
npm run dev
```

O comando inicia simultaneamente:

- Front-end: [http://localhost:3000](http://localhost:3000)
- Back-end: [http://localhost:3333/api](http://localhost:3333/api)

Na primeira execução, o back-end cria o banco SQLite e insere os dados de demonstração automaticamente.

## Deploy

O projeto está publicado na Vercel:

- Front-end: [https://class-hub-kohl.vercel.app](https://class-hub-kohl.vercel.app)
- Back-end/API: [https://class-hub-api.vercel.app/api](https://class-hub-api.vercel.app/api)

No deploy atual, o back-end utiliza SQLite em ambiente serverless, com o banco armazenado em `/tmp/engnet.sqlite`. Esse diretório é temporário na Vercel, portanto os dados criados manualmente, como chamadas registradas durante o uso, podem ser apagados quando a função reinicia ou quando a aplicação é atendida por outra instância.

Para manter a demonstração coerente mesmo com essa limitação, o back-end cria dados demonstrativos de aulas e frequências quando o banco do ambiente serverless inicia vazio. Assim, as telas de dashboard, baixa frequência e relatórios por turma continuam apresentando informações para avaliação do desafio.

### Variáveis de ambiente na Vercel

Back-end (`class-hub-api`):

| Variável | Valor usado |
|---|---|
| `FRONTEND_URL` | `https://class-hub-kohl.vercel.app` |
| `DATABASE_PATH` | `/tmp/engnet.sqlite` |
| `LOW_ATTENDANCE_THRESHOLD` | `75` |
| `AUTH_TOKEN_EXPIRATION_HOURS` | `8` |
| `AUTH_TOKEN_SECRET` | Segredo configurado no painel da Vercel |

Front-end (`class-hub`):

| Variável | Valor usado |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://class-hub-api.vercel.app/api` |

## Credenciais de demonstração

Todos os usuários iniciais utilizam a senha `123456`.

| Perfil | E-mail |
|---|---|
| Administrador | `admin@engnet.com` |
| Professores | `professor01@engnet.com` até `professor03@engnet.com` |
| Alunos | `aluno01@engnet.com` até `aluno15@engnet.com` |

## Testes e build

Para executar os testes de integração do back-end:

```bash
npm test
```

Para gerar o build de produção do front-end:

```bash
npm run build
```

Para executar as duas verificações em sequência:

```bash
npm run check
```

## Documentação

A documentação completa está na pasta [`docs`](docs/index.md) e inclui visão do produto, requisitos, backlog, arquitetura, banco de dados, integração entre front-end e back-end e padrões de desenvolvimento.

Para visualizar a documentação localmente, instale o MkDocs Material e execute:

```bash
pip install mkdocs-material
mkdocs serve
```

Outros documentos técnicos:

- [Contrato da API](backend/CONTRATO_API.md)
- [Arquitetura do sistema](docs/arquitetura/arquitetura_sistema.md)
- [Integração entre front-end e back-end](docs/arquitetura/integracao_front_back.md)
- [Banco de dados](docs/arquitetura/banco_de_dados.md)
- [Protótipo no Figma](https://www.figma.com/design/m8OxXvR1bH1cqBPvw5MWLD/Sistema-de-Presen%C3%A7a?node-id=0-1&p=f)

## Equipe

| Integrante | Atuação | GitHub |
|---|---|---|
| Enzo Menali | Back-end | [@menali17](https://github.com/menali17) |
| André Toussaint | Back-end | [@andreeetmt](https://github.com/andreeetmt) |
| Camila Silva | Front-end | [@CamilaSilvaC](https://github.com/CamilaSilvaC) |
| Beatriz Fernandes | Front-end | [@beatrizfernandes-del](https://github.com/beatrizfernandes-del) |
