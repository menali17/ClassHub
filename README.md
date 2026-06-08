# Desafio 4 Trainee EngNet

Sistema de gestao de presenca academica para aulas praticas e laboratoriais.

Esta branch deixa apenas a base inicial do front-end e do back-end para a equipe
comecar o desenvolvimento sem se perder nas pastas.

## Stack

- Front-end: Next.js, JavaScript, Tailwind CSS e HTML semantico.
- Back-end: NestJS e API REST.
- Documentacao: MkDocs.

## Estrutura

```text
.
|-- frontend   # Next.js, Tailwind e telas da aplicacao
|-- backend    # NestJS e API REST
|-- docs       # Documentacao do projeto
`-- mkdocs.yml # Configuracao do site de documentacao
```

## Como rodar

O frontend e o backend rodam separadamente. Abra dois terminais no VS Code.

### Terminal 1: back-end

```bash
cd backend
npm install
copy .env.example .env
npm run start:dev
```

### Terminal 2: front-end

```bash
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

## Onde acessar

- Front-end: `http://localhost:3000`
- API: `http://localhost:3333/api`

## O que tem em cada parte

- Leia [frontend/README.md](frontend/README.md) para mexer nas telas.
- Leia [backend/README.md](backend/README.md) para mexer na API.

## Proximos passos sugeridos

- Criar as telas dentro de `frontend/src/app`.
- Criar os modulos da API dentro de `backend/src`.
- Definir o banco de dados quando a equipe for implementar persistencia.
- Integrar o front-end com os endpoints do back-end.
