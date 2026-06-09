# Back-end

Esta pasta contem a API do sistema, feita com NestJS.

## Como rodar

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

## Onde mexer

```text
src/main.js           # inicia a API
src/app.module.js     # registra controllers e services
src/app.controller.js # recebe a requisicao HTTP inicial
src/app.service.js    # guarda a regra inicial
```

## Proximo passo

Quando a equipe comecar as funcionalidades, criem modulos seguindo o padrao do Nest:

```text
src/modules/turmas
src/modules/alunos
src/modules/aulas
src/modules/frequencias
src/modules/relatorios
```

Cada modulo pode ter `controller`, `service`, `module` e `dto`.
