# Contrato Inicial da API

Este documento define os formatos combinados entre o front-end e o back-end para o MVP do sistema. As rotas marcadas como **planejadas** ainda serão implementadas, mas seus formatos já podem ser usados pelo front-end com dados simulados.

## Configuração

- URL local: `http://localhost:3333/api`
- Front-end local permitido: `http://localhost:3000`
- Formato das requisições e respostas: JSON
- Autenticação planejada: token enviado no cabeçalho `Authorization: Bearer <token>`
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

**Situação:** planejada para 11/06.

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

**Situação:** planejada para 11/06.

Retorna os dados do usuário autenticado no mesmo formato do campo `usuario` apresentado no login.

## Turmas e alunos

### `GET /api/turmas`

**Situação:** planejada para 12/06.

```json
[
  {
    "id": 1,
    "nome": "Laboratório de Software",
    "codigo": "LAB-SW-01",
    "horario": "Segunda, 19:00",
    "quantidadeAlunos": 5
  }
]
```

### `POST /api/turmas`

**Situação:** planejada para 12/06.

```json
{
  "nome": "Laboratório de Software",
  "codigo": "LAB-SW-01",
  "horario": "Segunda, 19:00"
}
```

### `PATCH /api/turmas/:id`

**Situação:** planejada para 12/06.

Recebe apenas os campos da turma que serão alterados.

### `DELETE /api/turmas/:id`

**Situação:** planejada após o fluxo principal, por ser um requisito de prioridade média.

### `GET /api/turmas/:id/alunos`

**Situação:** planejada para 12/06.

```json
{
  "turma": {
    "id": 1,
    "nome": "Laboratório de Software",
    "codigo": "LAB-SW-01",
    "horario": "Segunda, 19:00"
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

## Aulas e frequência

### `POST /api/turmas/:turmaId/aulas`

**Situação:** planejada para 13/06.

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

### `PUT /api/aulas/:aulaId/frequencias`

**Situação:** planejada para 13/06.

Registra a chamada completa de uma aula.

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

Os únicos valores aceitos para `situacao` serão `presente` e `falta`.

### `GET /api/alunos/:alunoId/frequencia`

**Situação:** planejada para 13/06.

Professores e administradores consultam a frequência de um aluno.

### `GET /api/alunos/me/frequencia`

**Situação:** planejada para 13/06.

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
      "percentualPresenca": 75,
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
- Código de turma, e-mail e matrícula não podem se repetir.
- Um aluno pode estar vinculado a mais de uma turma.
- Frequência abaixo de `75%` é considerada baixa.
- QR Code não faz parte do escopo do projeto.
