# Contrato da API

Este documento define os formatos combinados entre o front-end e o back-end para o MVP do sistema. As rotas descritas abaixo estão implementadas e podem ser integradas pelo front-end.

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
  "email": "professor01@engnet.com",
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
    "nome": "Prof. Carlos Henrique",
    "email": "professor01@engnet.com",
    "matricula": null,
    "perfil": "professor",
    "fotoUrl": null,
    "telefone": null,
    "departamento": null,
    "ativo": true
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

## Perfil do usuário

| Método | Rota | Acesso | Finalidade |
|---|---|---|---|
| `GET` | `/api/perfil` | Usuário autenticado | Consulta os próprios dados. |
| `PATCH` | `/api/perfil` | Usuário autenticado | Altera nome, e-mail, foto, telefone e departamento quando aplicável. |
| `PATCH` | `/api/perfil/senha` | Usuário autenticado | Altera a senha após validar a senha atual. |

Exemplo de atualização:

```json
{
  "nome": "Professor Atualizado",
  "telefone": "(61) 99999-0000",
  "fotoUrl": "https://exemplo.com/foto.jpg"
}
```

Exemplo de alteração de senha:

```json
{
  "senhaAtual": "123456",
  "novaSenha": "654321"
}
```

## Administração de usuários

As operações de cadastro, edição, redefinição de senha e desativação são exclusivas do administrador. As listagens retornam apenas usuários ativos.

| Método | Rota | Finalidade |
|---|---|---|
| `GET` | `/api/alunos` | Lista os alunos ativos. |
| `POST` | `/api/alunos` | Cadastra um aluno. |
| `GET` | `/api/alunos/:id` | Consulta um aluno e suas turmas. |
| `PATCH` | `/api/alunos/:id` | Edita os dados de um aluno. |
| `POST` | `/api/alunos/:id/redefinir-senha` | Define uma nova senha para o aluno. |
| `DELETE` | `/api/alunos/:id` | Desativa o aluno, seus vínculos ativos e suas sessões. |
| `GET` | `/api/professores` | Lista os professores ativos. |
| `POST` | `/api/professores` | Cadastra um professor. |
| `GET` | `/api/professores/:id` | Consulta um professor e suas turmas. |
| `PATCH` | `/api/professores/:id` | Edita os dados de um professor. |
| `POST` | `/api/professores/:id/redefinir-senha` | Define uma nova senha para o professor. |
| `DELETE` | `/api/professores/:id` | Desativa o professor e revoga suas sessões. |

Cadastro de aluno:

```json
{
  "nome": "Ana Souza",
  "email": "ana@engnet.com",
  "matricula": "20260001",
  "senha": "123456",
  "telefone": "(61) 99999-0000"
}
```

Cadastro de professor:

```json
{
  "nome": "Marina Lima",
  "email": "marina@engnet.com",
  "senha": "123456",
  "departamento": "Engenharia de Software",
  "telefone": "(61) 99999-0000"
}
```

Para redefinir uma senha, envie `{ "novaSenha": "654321" }`. Um professor só pode ser desativado depois que suas turmas forem transferidas para outro professor.

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
    "quantidadeAlunos": 7,
    "percentualPresenca": 89.29
  }
]
```

### `GET /api/turmas/minhas`

**Situação:** implementada.

Rota exclusiva do aluno. Retorna somente as turmas às quais o usuário autenticado está vinculado, incluindo professor responsável, total de aulas, presenças, faltas e percentual de frequência do próprio aluno.

### `POST /api/turmas`

**Situação:** implementada.

Rota exclusiva do administrador. O professor responsável deve estar ativo e ser informado no corpo da requisição.

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

Rota exclusiva do administrador. Recebe apenas os campos da turma que serão alterados.

```json
{
  "nome": "Laboratório de Sistemas",
  "horario": "Segunda, 20:00"
}
```

O campo `professorId` pode ser utilizado para transferir a turma para outro professor ativo.

### `DELETE /api/turmas/:id`

**Situação:** implementada.

Apenas o administrador pode remover a turma. A remoção também exclui aulas, frequências e vínculos relacionados.

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

### `DELETE /api/turmas/:id/alunos/:alunoId`

**Situação:** implementada.

Desvincula o aluno da turma sem apagar o cadastro do usuário. O vínculo é mantido como inativo para preservar seu histórico.

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
    "nome": "Prof. Carlos Henrique",
    "email": "professor01@engnet.com",
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
  "limiteBaixaFrequencia": 75,
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

**Situação:** implementada em 14/06/2026.

Disponível para professores e administradores. O professor recebe indicadores
somente das turmas sob sua responsabilidade. O administrador recebe os dados
gerais do sistema.

```json
{
  "totalAlunos": 10,
  "totalProfessores": 1,
  "totalTurmas": 2,
  "totalAulas": 4,
  "taxaMediaPresenca": 82.5,
  "limiteBaixaFrequencia": 75,
  "evolucaoSemanal": [
    {
      "semana": "10/06",
      "valor": 82.5
    }
  ],
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

Alunos sem aulas finalizadas não são classificados como baixa frequência. O
alerta é exibido apenas quando existe ao menos uma chamada registrada e o
percentual é menor que `75%`.

## Relatórios

As rotas de relatórios estão disponíveis para professores e administradores.
O professor acessa somente dados relacionados às próprias turmas.

### `GET /api/relatorios/alunos/:alunoId`

**Situação:** implementada em 14/06/2026.

Gera o relatório individual com resumo geral, percentuais por turma e histórico
de presenças e faltas. A resposta possui o mesmo conteúdo da consulta de
frequência do aluno, acrescido do campo `geradoEm`.

```json
{
  "geradoEm": "2026-06-14T18:00:00.000Z",
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
  "turmas": []
}
```

### `GET /api/relatorios/alunos-baixa-frequencia`

**Situação:** implementada em 14/06/2026.

Lista os alunos com percentual abaixo do limite configurado. O filtro de turma
é opcional:

```text
GET /api/relatorios/alunos-baixa-frequencia?turmaId=1
```

Resposta:

```json
{
  "geradoEm": "2026-06-14T18:00:00.000Z",
  "limiteBaixaFrequencia": 75,
  "turma": {
    "id": 1,
    "nome": "Laboratório de Software",
    "codigo": "LAB-SW-01"
  },
  "totalAlunos": 1,
  "alunos": [
    {
      "id": 3,
      "nome": "Ana Souza",
      "matricula": "20260001",
      "turma": {
        "id": 1,
        "nome": "Laboratório de Software",
        "codigo": "LAB-SW-01"
      },
      "totalAulas": 4,
      "presencas": 2,
      "faltas": 2,
      "percentualPresenca": 50
    }
  ]
}
```

Quando `turmaId` não é informado, o campo `turma` da resposta recebe `null` e
o relatório considera todas as turmas permitidas para o usuário.

### `GET /api/relatorios/turmas/:turmaId`

**Situação:** implementada em 14/06/2026.

Gera o histórico completo da turma, com resumo geral, percentual de cada aluno
e registros de cada aula finalizada.

```json
{
  "geradoEm": "2026-06-14T18:00:00.000Z",
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
  "resumo": {
    "totalAlunos": 5,
    "totalAulas": 4,
    "presencas": 17,
    "faltas": 3,
    "percentualPresenca": 85
  },
  "alunos": [],
  "aulas": []
}
```

### Exportação de relatórios

Os relatórios podem ser baixados em PDF ou planilha Excel pelo parâmetro `formato`:

| Relatório | Rota de download |
|---|---|
| Individual | `GET /api/relatorios/alunos/:alunoId/exportar?formato=pdf` |
| Baixa frequência | `GET /api/relatorios/alunos-baixa-frequencia/exportar?formato=xlsx&turmaId=:id` |
| Turma | `GET /api/relatorios/turmas/:turmaId/exportar?formato=pdf` |
| Geral de alunos | `GET /api/relatorios/alunos/exportar?formato=xlsx` |
| Geral de turmas | `GET /api/relatorios/turmas/exportar?formato=pdf` |

Os formatos aceitos são `pdf` e `xlsx`. A resposta possui `Content-Disposition: attachment` para iniciar o download no navegador.

## Regras confirmadas

- O professor registra presença ou falta de cada aluno.
- O aluno apenas consulta a própria frequência.
- Professores e administradores podem consultar históricos e relatórios.
- Apenas o administrador remove turmas.
- Apenas o administrador cadastra, edita e desativa professores e alunos.
- A desativação de um usuário revoga suas sessões e impede novos logins.
- Um professor com turmas atribuídas não pode ser desativado antes da transferência.
- Professores gerenciam apenas as turmas atribuídas a eles.
- Administradores podem gerenciar todas as turmas.
- Código de turma, e-mail e matrícula não podem se repetir.
- Um aluno pode estar vinculado a mais de uma turma.
- Frequência abaixo de `75%` é considerada baixa.
- QR Code não faz parte do escopo do projeto.

## Histórico de versão

| Versão | Data | Descrição | Autor(es) |
|---|---|---|---|
| 1.0 | 14/06/2026 | Documentação das rotas iniciais de autenticação, turmas, frequência e relatórios. | Enzo Menali |
| 1.1 | 14/06/2026 | Inclusão do fluxo administrativo, perfil, remoções e exportações em PDF e XLSX. | Enzo Menali |
| 1.2 | 15/06/2026 | Inclusão da evolução semanal, edição completa de perfil e exportações gerais. | Enzo Menali |
