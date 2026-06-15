# Setup Técnico

Esta página apresenta os requisitos e comandos necessários para executar o ClassHub localmente.

## Pré-requisitos

- Node.js 22.5 ou superior.
- npm.
- Git.
- Python e MkDocs Material apenas para visualizar a documentação localmente.

## Estrutura

| Caminho | Responsabilidade |
|---|---|
| `frontend` | Aplicação web em Next.js, React, JavaScript e Tailwind CSS. |
| `backend` | API REST em NestJS e testes de integração. |
| `backend/data` | Banco SQLite criado durante a execução local. |
| `docs` | Documentação do produto e do projeto. |

## Instalação

Na raiz do repositório, instale as dependências dos três pacotes:

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

## Variáveis de ambiente

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

As configurações padrão são:

| Variável | Valor padrão | Responsabilidade |
|---|---|---|
| `PORT` | `3333` | Porta do back-end. |
| `FRONTEND_URL` | `http://localhost:3000` | Origem permitida pelo CORS. |
| `DATABASE_PATH` | `./data/engnet.sqlite` | Caminho do arquivo SQLite. |
| `LOW_ATTENDANCE_THRESHOLD` | `75` | Limite de baixa frequência. |
| `AUTH_TOKEN_EXPIRATION_HOURS` | `8` | Duração da sessão. |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3333/api` | URL utilizada pelo front-end. |

## Execução

Na raiz do projeto:

```bash
npm run dev
```

Esse comando inicia o front-end em `http://localhost:3000` e a API em `http://localhost:3333/api`.

Na primeira execução, o back-end cria o banco em `backend/data/engnet.sqlite` e insere os dados de demonstração.

## Testes e build

```bash
npm test
npm run build
```

Para executar as duas verificações em sequência:

```bash
npm run check
```

## Documentação

```bash
pip install mkdocs-material
mkdocs serve
```

Para validar a documentação antes do envio:

```bash
mkdocs build --strict
```

## Publicação

O front-end será publicado na Vercel e deverá receber a variável `NEXT_PUBLIC_API_URL` com o endereço público da API. O back-end atual utiliza NestJS e um arquivo SQLite, portanto deve ser executado em um ambiente Node.js com armazenamento persistente. Publicar somente o front-end não disponibiliza os dados nem as funcionalidades da API.

A documentação é publicada separadamente no GitHub Pages pelo workflow `.github/workflows/deploy-docs.yml` quando alterações chegam à branch `main`.

## Histórico de Versão

| Versão | Data | Descrição | Autor(es) |
|---|---|---|---|
| 1.0 | 14/06/2026 | Atualização do setup com a configuração do banco SQLite. | Enzo Menali |
| 2.0 | 15/06/2026 | Inclusão da instalação completa, variáveis de ambiente, verificações e estratégia de publicação. | Enzo Menali |
| 2.1 | 15/06/2026 | Detalhamento da publicação do front-end e dos requisitos de execução persistente do back-end. | Enzo Menali |
