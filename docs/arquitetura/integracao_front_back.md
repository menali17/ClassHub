# Integração entre Front-end e Back-end

Este documento define o padrão de comunicação entre o front-end desenvolvido em Next.js e a API REST desenvolvida em NestJS.

O objetivo é manter as requisições e respostas previsíveis, reduzir divergências entre as duas aplicações e facilitar a implementação das telas do sistema.

Os formatos completos dos corpos das requisições e respostas estão documentados em `backend/CONTRATO_API.md`. Sempre que uma rota, campo ou regra da API for alterada, o contrato também deverá ser atualizado.

---

## 1. Situação atual

O back-end já disponibiliza recursos para:

* autenticação e encerramento de sessão;
* consulta e atualização de perfil;
* administração de alunos e professores;
* gerenciamento de turmas;
* criação de aulas;
* registro e consulta de frequências;
* consulta do dashboard;
* geração e exportação de relatórios.

O front-end possui a estrutura inicial em Next.js, mas ainda precisa integrar suas páginas e componentes às rotas disponíveis na API.

Este documento descreve o padrão recomendado para essa integração. As pastas e arquivos sugeridos para o front-end ainda deverão ser criados durante a implementação.

---

## 2. Endereços locais

| Aplicação | Endereço padrão             |
| --------- | --------------------------- |
| Front-end | `http://localhost:3000`     |
| API       | `http://localhost:3333/api` |

No back-end, a variável `FRONTEND_URL` define qual origem pode acessar a API por meio do CORS:

```env
FRONTEND_URL=http://localhost:3000
```

No front-end, o endereço-base da API deverá ser definido em uma variável pública de ambiente:

```env
NEXT_PUBLIC_API_URL=http://localhost:3333/api
```

Essa variável deverá ser adicionada ao arquivo `.env.local` do front-end quando a integração for iniciada.

---

## 3. Formato da comunicação

O front-end e o back-end se comunicam por HTTP e utilizam JSON para troca de dados.

As requisições que enviam conteúdo devem incluir o cabeçalho:

```text
Content-Type: application/json
```

As rotas protegidas também exigem o token da sessão:

```text
Authorization: Bearer <token>
```

O front-end não deve acessar diretamente o arquivo SQLite. Toda leitura ou alteração de dados deve ocorrer por meio da API.

---

## 4. Fluxo de autenticação

O fluxo de autenticação deve seguir estas etapas:

1. O usuário informa e-mail e senha no front-end.
2. O front-end envia uma requisição para `POST /auth/login`.
3. A API valida as credenciais.
4. A API retorna o token da sessão e os dados do usuário autenticado.
5. O front-end armazena o token durante a sessão.
6. As requisições protegidas enviam o token no cabeçalho `Authorization`.
7. Ao carregar novamente a aplicação, o front-end pode consultar `GET /auth/me` para validar a sessão.
8. No logout, o front-end envia `POST /auth/logout`.
9. A API revoga a sessão e o front-end remove o token armazenado.

### Exemplo de login

```javascript
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      senha,
    }),
  },
);

const data = await response.json();

if (!response.ok) {
  throw new Error(data.message || "Não foi possível realizar o login.");
}
```

### Exemplo de requisição protegida

```javascript
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/turmas`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  },
);
```

O back-end continua responsável pela validação definitiva das permissões. Ocultar uma funcionalidade na interface não substitui a autorização realizada pela API.

---

## 5. Rotas disponíveis

As rotas apresentadas nesta seção consideram a URL-base:

```text
http://localhost:3333/api
```

Por isso, os caminhos são apresentados sem repetir o prefixo `/api`.

### 5.1 Autenticação

| Método | Rota           | Finalidade                         |
| ------ | -------------- | ---------------------------------- |
| `POST` | `/auth/login`  | Iniciar uma sessão.                |
| `GET`  | `/auth/me`     | Consultar o usuário autenticado.   |
| `POST` | `/auth/logout` | Encerrar e revogar a sessão atual. |

---

### 5.2 Perfil do usuário

| Método  | Rota            | Finalidade                   |
| ------- | --------------- | ---------------------------- |
| `GET`   | `/perfil`       | Consultar os próprios dados. |
| `PATCH` | `/perfil`       | Atualizar os próprios dados. |
| `PATCH` | `/perfil/senha` | Alterar a própria senha.     |

---

### 5.3 Administração de alunos

As operações de cadastro, edição, redefinição de senha e desativação são destinadas ao administrador.

| Método   | Rota                          | Finalidade                           |
| -------- | ----------------------------- | ------------------------------------ |
| `GET`    | `/alunos`                     | Listar os alunos cadastrados.        |
| `POST`   | `/alunos`                     | Cadastrar um aluno.                  |
| `GET`    | `/alunos/:id`                 | Consultar um aluno e suas turmas.    |
| `PATCH`  | `/alunos/:id`                 | Editar os dados de um aluno.         |
| `DELETE` | `/alunos/:id`                 | Desativar um aluno.                  |
| `POST`   | `/alunos/:id/redefinir-senha` | Definir uma nova senha para o aluno. |

---

### 5.4 Administração de professores

| Método   | Rota                               | Finalidade                               |
| -------- | ---------------------------------- | ---------------------------------------- |
| `GET`    | `/professores`                     | Listar os professores cadastrados.       |
| `POST`   | `/professores`                     | Cadastrar um professor.                  |
| `GET`    | `/professores/:id`                 | Consultar um professor e suas turmas.    |
| `PATCH`  | `/professores/:id`                 | Editar os dados de um professor.         |
| `DELETE` | `/professores/:id`                 | Desativar um professor.                  |
| `POST`   | `/professores/:id/redefinir-senha` | Definir uma nova senha para o professor. |

---

### 5.5 Gerenciamento de turmas

| Método   | Rota                          | Finalidade                                   |
| -------- | ----------------------------- | -------------------------------------------- |
| `GET`    | `/turmas`                     | Listar as turmas disponíveis para o usuário. |
| `POST`   | `/turmas`                     | Criar uma turma.                             |
| `GET`    | `/turmas/:id`                 | Consultar os dados de uma turma.             |
| `PATCH`  | `/turmas/:id`                 | Editar os dados de uma turma.                |
| `DELETE` | `/turmas/:id`                 | Remover uma turma como administrador.        |
| `GET`    | `/turmas/:id/alunos`          | Listar os alunos vinculados à turma.         |
| `POST`   | `/turmas/:id/alunos`          | Vincular um aluno à turma.                   |
| `DELETE` | `/turmas/:id/alunos/:alunoId` | Desvincular um aluno da turma.               |

O professor deve visualizar e alterar apenas as turmas pelas quais é responsável. O administrador pode acessar todas as turmas.

---

### 5.6 Aulas e frequências

| Método | Rota                          | Finalidade                                                     |
| ------ | ----------------------------- | -------------------------------------------------------------- |
| `POST` | `/turmas/:turmaId/aulas`      | Criar uma aula para a turma.                                   |
| `GET`  | `/turmas/:turmaId/aulas`      | Listar as aulas da turma.                                      |
| `PUT`  | `/aulas/:aulaId/frequencias`  | Registrar ou corrigir a chamada completa.                      |
| `GET`  | `/alunos/:alunoId/frequencia` | Consultar o histórico e os percentuais de um aluno autorizado. |
| `GET`  | `/alunos/me/frequencia`       | Consultar a frequência do aluno autenticado.                   |

A chamada deve enviar a situação de todos os alunos atualmente vinculados à turma. O reenvio da chamada atualiza os registros existentes sem criar duplicações.

---

### 5.7 Dashboard

| Método | Rota         | Finalidade                                                              |
| ------ | ------------ | ----------------------------------------------------------------------- |
| `GET`  | `/dashboard` | Consultar totais, taxa média de presença e alertas de baixa frequência. |

Para professores, os indicadores devem considerar somente as turmas sob sua responsabilidade.

---

### 5.8 Relatórios

| Método | Rota                                                        | Finalidade                                          |
| ------ | ----------------------------------------------------------- | --------------------------------------------------- |
| `GET`  | `/relatorios/alunos/:alunoId`                               | Consultar o relatório individual de um aluno.       |
| `GET`  | `/relatorios/alunos-baixa-frequencia`                       | Consultar os alunos abaixo do limite de frequência. |
| `GET`  | `/relatorios/alunos-baixa-frequencia?turmaId=:id`           | Filtrar a baixa frequência por turma.               |
| `GET`  | `/relatorios/turmas/:turmaId`                               | Consultar o histórico completo de uma turma.        |
| `GET`  | `/relatorios/alunos/:alunoId/exportar?formato=pdf`          | Exportar o relatório individual em PDF.             |
| `GET`  | `/relatorios/alunos/:alunoId/exportar?formato=xlsx`         | Exportar o relatório individual em XLSX.            |
| `GET`  | `/relatorios/alunos-baixa-frequencia/exportar?formato=pdf`  | Exportar a lista de baixa frequência em PDF.        |
| `GET`  | `/relatorios/alunos-baixa-frequencia/exportar?formato=xlsx` | Exportar a lista de baixa frequência em XLSX.       |
| `GET`  | `/relatorios/turmas/:turmaId/exportar?formato=pdf`          | Exportar o relatório da turma em PDF.               |
| `GET`  | `/relatorios/turmas/:turmaId/exportar?formato=xlsx`         | Exportar o relatório da turma em XLSX.              |

Os exemplos completos dos corpos, parâmetros e respostas estão disponíveis em `backend/CONTRATO_API.md`.

---

## 6. Organização recomendada no front-end

Para evitar requisições HTTP espalhadas entre páginas e componentes, recomenda-se centralizar a integração em uma camada de serviços.

```text
frontend/src/
├── app/
├── components/
├── contexts/
│   └── auth-context.jsx
└── services/
    ├── api.js
    ├── auth.js
    ├── usuarios.js
    ├── turmas.js
    ├── frequencias.js
    └── relatorios.js
```

Responsabilidades sugeridas:

* `api.js`: URL-base, cabeçalhos, token e tratamento comum de respostas;
* `auth.js`: login, consulta da sessão e logout;
* `usuarios.js`: perfil, alunos e professores;
* `turmas.js`: turmas e vínculos de alunos;
* `frequencias.js`: aulas, chamadas e históricos;
* `relatorios.js`: dashboard, relatórios e exportações;
* `auth-context.jsx`: estado do usuário autenticado e controle da sessão.

Essa estrutura representa uma recomendação para a implementação e ainda deverá ser criada no front-end.

---

## 7. Tratamento de respostas

O front-end deve verificar `response.ok` antes de considerar uma requisição bem-sucedida.

| Código | Significado                           | Comportamento esperado                                           |
| -----: | ------------------------------------- | ---------------------------------------------------------------- |
|  `200` | Consulta ou alteração concluída.      | Atualizar a interface e informar sucesso quando necessário.      |
|  `201` | Registro criado.                      | Exibir o novo item ou retornar à listagem.                       |
|  `400` | Dados inválidos ou incompletos.       | Exibir a mensagem próxima ao formulário ou campo correspondente. |
|  `401` | Sessão ausente, inválida ou expirada. | Limpar os dados da sessão e redirecionar para o login.           |
|  `403` | Usuário sem permissão.                | Informar que a ação não está disponível para aquele perfil.      |
|  `404` | Registro não encontrado.              | Informar que o conteúdo solicitado não existe.                   |
|  `409` | Conflito ou dado duplicado.           | Apresentar a mensagem devolvida pela API.                        |
|  `500` | Erro interno.                         | Informar uma falha temporária sem expor detalhes técnicos.       |

Durante o envio de uma requisição, os botões de confirmação devem permanecer desabilitados para evitar ações duplicadas.

A interface também deve apresentar:

* estados de carregamento;
* mensagens de sucesso;
* mensagens de erro;
* confirmação para ações destrutivas;
* feedback após criação, edição ou remoção de registros.

---

## 8. Regras de integração

A integração deve respeitar as seguintes regras:

* o front-end nunca deve acessar o banco SQLite diretamente;
* todas as operações devem ocorrer por meio da API REST;
* o token deve ser enviado nas rotas protegidas;
* as funcionalidades apresentadas devem considerar o perfil autenticado;
* o back-end continua responsável pela autorização definitiva;
* datas de aula devem usar o formato `AAAA-MM-DD`;
* horários devem usar o formato `HH:mm`;
* a situação da frequência aceita apenas `presente` ou `falta`;
* a chamada deve incluir todos os alunos vinculados à turma;
* frequências abaixo do limite definido no back-end devem ser apresentadas como baixa frequência;
* alterações nas rotas, campos ou respostas devem ser registradas no contrato da API antes da atualização do front-end.

O limite padrão de baixa frequência é `75%`, mas esse valor pode ser alterado no back-end por meio da variável `LOW_ATTENDANCE_THRESHOLD`. Por isso, sempre que possível, o front-end deve utilizar o valor retornado pela API, evitando repetir uma regra fixa na interface.

---

## 9. Sequência recomendada de implementação

A integração pode ser realizada na seguinte ordem:

1. Configurar `NEXT_PUBLIC_API_URL`.
2. Criar o cliente HTTP compartilhado.
3. Implementar login, consulta da sessão e logout.
4. Criar o contexto de autenticação.
5. Integrar a listagem e o gerenciamento de turmas.
6. Integrar a listagem e o vínculo de alunos.
7. Integrar as telas administrativas de alunos e professores.
8. Integrar a criação de aulas.
9. Integrar o registro e a correção da chamada.
10. Integrar o dashboard.
11. Integrar os relatórios e os downloads.
12. Integrar a consulta de frequência do aluno.
13. Validar os fluxos dos perfis de administrador, professor e aluno.
14. Validar estados de carregamento, ausência de dados e respostas de erro.

---

## 10. Documentos relacionados

* [Arquitetura do Sistema](arquitetura_sistema.md)
* [Banco de Dados](banco_de_dados.md)
* [Contrato da API no GitHub](CONTRATO_API.md)

---

## Histórico de versão

| Versão | Data       | Descrição                                                                                          | Autor(es)   |
| ------ | ---------- | -------------------------------------------------------------------------------------------------- | ----------- |
| 1.0    | 14/06/2026 | Definição inicial do padrão de integração entre Next.js e a API NestJS.                            | Enzo Menali |
| 1.1    | 14/06/2026 | Inclusão das rotas administrativas, perfil, dashboard e exportação de relatórios.                  | Enzo Menali |
| 1.2    | 14/06/2026 | Reorganização das rotas, esclarecimento da situação atual e detalhamento das regras de integração. | Enzo Menali |
