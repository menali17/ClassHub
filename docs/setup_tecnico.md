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

O projeto utiliza SQLite com o módulo nativo `node:sqlite`. O arquivo do banco é
criado automaticamente em `backend/data/engnet.sqlite` na primeira execução da
API. A estrutura completa está descrita em [Banco de Dados](arquitetura/banco_de_dados.md).

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

## Histórico de Versão

| Versão | Data | Descrição | Autor(es) |
|---|---|---|---|
| 1.0 | 14/06/2026 | Atualização do setup com a configuração atual do banco SQLite. | Enzo Menali |
