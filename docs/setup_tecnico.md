# Setup Tecnico

Esta pagina descreve a estrutura tecnica inicial do projeto para que a equipe consiga dividir as tarefas com clareza.

## Estrutura

O projeto foi organizado em duas pastas principais, uma para o front-end e outra para o back-end.

| Caminho | Responsabilidade |
|---|---|
| `frontend` | Aplicacao web em Next.js, JavaScript e Tailwind CSS. |
| `backend` | API REST em NestJS. |
| `docs` | Documentacao do produto e do projeto. |

Cada parte deve ser rodada separadamente. Isso facilita para quem ainda esta aprendendo VS Code, terminal e GitHub.

## Front-end

O front-end foi iniciado com Next.js e Tailwind CSS.

As novas telas podem ser criadas dentro de `frontend/src/app`.

## Back-end

O back-end foi iniciado com NestJS.

Os modulos da API podem ser criados conforme a equipe implementar as funcionalidades.

## Banco de dados

--

## Comandos

```bash
cd backend
npm install
npm run start:dev
```

```bash
cd frontend
npm install
npm run dev
```
