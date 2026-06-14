# Contrato Inicial da API

Este documento define os formatos combinados entre o front-end e o back-end para o MVP do sistema. As rotas marcadas como **planejadas** ainda serão implementadas, mas seus formatos já podem ser usados pelo front-end com dados simulados.

## Configuração

- URL local: `http://localhost:3333/api`
- Front-end local permitido: `http://localhost:3000`
- Formato das requisições e respostas: JSON
- Autenticação: token enviado no cabeçalho `Authorization: Bearer <token>`
- Duração padrão da sessão: 8 horas
- Baixa frequência: percentual menor que `75%`

## Resposta de erro

Todas as rotas devem seguir este formato quando ocorrer um erro:

```json
{
  "statusCode": 400,
  "message": "Descrição clara do problema",
  "error": "Bad Request"
}
```

## Verificação da API

### `GET /api`

**Situação:** implementada.

Confirma que o back-end e o banco estão funcionando.

```json
{
  "message": "Back-end NestJS iniciado",
  "database": {
    "status": "conectado",
    "registros": {
      "usuarios": 12,
      "alunos": 10,
      "professores": 1,
      "administradores": 1,
      "turmas": 2,
      "aulas": 0,
      "frequencias": 0,
      "limiteBaixaFrequencia": 75
    }
  }
}
```

## Autenticação

### `POST /api/auth/login`

**Situação:** implementada.

Requisição:

```json
{
  "email": "professor@engnet.com",
  "senha": "123456"
}
```

Resposta de sucesso:

```json
{
  "token": "token-de-acesso",
  "expiraEm": "2026-06-12T07:00:00.000Z",
  "usuario": {
    "id": 2,
    "nome": "Professor EngNet",
    "email": "professor@engnet.com",
    "matricula": null,
    "perfil": "professor",
    "fotoUrl": null
  }
}
```

### `GET /api/auth/me`

**Situação:** implementada.

Retorna os dados do usuário autenticado no mesmo formato do campo `usuario` apresentado no login.

Cabeçalho obrigatório:

```text
Authorization: Bearer <token>
```

### `POST /api/auth/logout`

**Situação:** implementada.

Invalida o token utilizado na requisição.

Cabeçalho obrigatório:

```text
Authorization: Bearer <token>
```

Resposta:

```json
{
  "message": "Logout realizado com sucesso."
}
```

Depois do logout, o token não pode mais acessar rotas protegidas.

## Turmas e alunos

### `GET /api/turmas`

**Situação:** implementada.

Professores visualizam apenas suas turmas. Administradores visualizam todas.

```json
[
  {
    "id": 1,
    "nome": "Laboratório de Software",
    "codigo": "LAB-SW-01",
    "horario": "Segunda, 19:00",
    "professor": {
      "id": 2,
      "nome": "Professor EngNet"
    },
    "quantidadeAlunos": 5
  }
]
```

### `POST /api/turmas`

**Situação:** implementada.

Quando o usuário autenticado é professor, a turma é atribuída automaticamente a ele.

```json
{
  "nome": "Laboratório de Software",
  "codigo": "LAB-SW-01",
  "horario": "Segunda, 19:00"
}
```

Quando o usuário é administrador, também deve informar o professor responsável:

```json
{
  "nome": "Laboratório de Software",
  "codigo": "LAB-SW-01",
  "horario": "Segunda, 19:00",
  "professorId": 2
}
```

### `GET /api/turmas/:id`

**Situação:** implementada.

Retorna uma turma específica. O professor só pode consultar turmas atribuídas a ele.

### `PATCH /api/turmas/:id`

**Situação:** implementada.

Recebe apenas os campos da turma que serão alterados.

```json
{
  "nome": "Laboratório de Sistemas",
  "horario": "Segunda, 20:00"
}
```

Apenas administradores podem alterar `professorId`.

### `DELETE /api/turmas/:id`

**Situação:** planejada após o fluxo principal, por ser um requisito de prioridade média.

### `GET /api/turmas/:id/alunos`

**Situação:** implementada.

```json
{
  "turma": {
    "id": 1,
    "nome": "Laboratório de Software",
    "codigo": "LAB-SW-01",
    "horario": "Segunda, 19:00",
    "professor": {
      "id": 2,
      "nome": "Professor EngNet"
    }
  },
  "quantidadeAlunos": 5,
  "alunos": [
    {
      "id": 3,
      "nome": "Ana Souza",
      "email": "aluno01@engnet.com",
      "matricula": "20260001",
      "fotoUrl": null
    }
  ]
}
```

### `POST /api/turmas/:id/alunos`

**Situação:** implementada.

Vincula um aluno existente à turma. O mesmo aluno pode participar de mais de uma turma.

```json
{
  "alunoId": 3
}
```

O sistema retorna `409` quando o aluno já está vinculado à turma.

### `GET /api/alunos`

**Situação:** implementada.

Lista os alunos disponíveis para professores e administradores.

```json
[
  {
    "id": 3,
    "nome": "Ana Souza",
    "email": "aluno01@engnet.com",
    "matricula": "20260001",
    "fotoUrl": null
  }
]
```

### `GET /api/professores`

**Situação:** implementada.

Lista os professores disponíveis para o administrador atribuir a uma turma. Professores e alunos não podem acessar esta rota.

```json
[
  {
    "id": 2,
    "nome": "Professor EngNet",
    "email": "professor@engnet.com",
    "fotoUrl": null
  }
]
```

## Aulas e frequência

### `POST /api/turmas/:turmaId/aulas`

**Situação:** implementada em 14/06/2026.

Somente o professor responsável pela turma pode criar a aula. Uma mesma turma
não pode possuir duas aulas com a mesma data e horário.

```json
{
  "data": "2026-06-13",
  "horario": "19:00"
}
```

Resposta:

```json
{
  "id": 1,
  "turmaId": 1,
  "data": "2026-06-13",
  "horario": "19:00",
  "status": "aberta"
}
```

### `GET /api/turmas/:turmaId/aulas`

**Situação:** implementada em 14/06/2026.

O professor responsável e o administrador podem listar as aulas da turma.

```json
{
  "turma": {
    "id": 1,
    "nome": "Laboratório de Software",
    "codigo": "LAB-SW-01"
  },
  "aulas": [
    {
      "id": 1,
      "turmaId": 1,
      "data": "2026-06-13",
      "horario": "19:00",
      "status": "finalizada",
      "frequenciasRegistradas": 5
    }
  ]
}
```

### `PUT /api/aulas/:aulaId/frequencias`

**Situação:** implementada em 14/06/2026.

O professor responsável registra a chamada completa de uma aula. Todos os
alunos vinculados à turma devem ser informados uma única vez.

```json
{
  "frequencias": [
    {
      "alunoId": 3,
      "situacao": "presente"
    },
    {
      "alunoId": 4,
      "situacao": "falta"
    }
  ]
}
```

Os únicos valores aceitos para `situacao` são `presente` e `falta`. Após o
registro, a aula recebe o status `finalizada`. Reenviar a chamada atualiza os
registros existentes, permitindo correções sem criar frequências duplicadas.

Resposta:

```json
{
  "message": "Chamada registrada com sucesso.",
  "aula": {
    "id": 1,
    "turmaId": 1,
    "data": "2026-06-13",
    "horario": "19:00",
    "status": "finalizada"
  },
  "resumo": {
    "totalAlunos": 5,
    "presentes": 4,
    "faltas": 1
  },
  "frequencias": [
    {
      "alunoId": 3,
      "nome": "Ana Souza",
      "matricula": "20260001",
      "situacao": "presente"
    }
  ]
}
```

### `GET /api/alunos/:alunoId/frequencia`

**Situação:** implementada em 14/06/2026.

O professor consulta alunos vinculados às próprias turmas. O administrador
pode consultar qualquer aluno.

### `GET /api/alunos/me/frequencia`

**Situação:** implementada em 14/06/2026.

O aluno autenticado consulta apenas a própria frequência.

Resposta das duas consultas:

```json
{
  "aluno": {
    "id": 3,
    "nome": "Ana Souza",
    "matricula": "20260001"
  },
  "resumoGeral": {
    "totalAulas": 4,
    "presencas": 3,
    "faltas": 1,
    "percentualPresenca": 75,
    "baixaFrequencia": false
  },
  "turmas": [
    {
      "turmaId": 1,
      "nome": "Laboratório de Software",
      "codigo": "LAB-SW-01",
      "totalAulas": 4,
      "presencas": 3,
      "faltas": 1,
      "percentualPresenca": 75,
      "baixaFrequencia": false,
      "historico": [
        {
          "aulaId": 1,
          "data": "2026-06-13",
          "horario": "19:00",
          "situacao": "presente"
        }
      ]
    }
  ]
}
```

## Dashboard

### `GET /api/dashboard`

**Situação:** planejada para 14/06.

```json
{
  "totalAlunos": 10,
  "totalAulas": 4,
  "taxaMediaPresenca": 82.5,
  "limiteBaixaFrequencia": 75,
  "alunosComBaixaFrequencia": [
    {
      "id": 4,
      "nome": "Bruno Lima",
      "matricula": "20260002",
      "turma": "Laboratório de Software",
      "percentualPresenca": 50
    }
  ]
}
```

## Regras confirmadas

- O professor registra presença ou falta de cada aluno.
- O aluno apenas consulta a própria frequência.
- Professores e administradores podem consultar históricos e relatórios.
- Apenas o administrador remove turmas.
- Professores gerenciam apenas as turmas atribuídas a eles.
- Administradores podem gerenciar todas as turmas.
- Código de turma, e-mail e matrícula não podem se repetir.
- Um aluno pode estar vinculado a mais de uma turma.
- Frequência abaixo de `75%` é considerada baixa.
- QR Code não faz parte do escopo do projeto.
