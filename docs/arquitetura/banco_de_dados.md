# Banco de Dados

Este documento apresenta como os dados do sistema de gestão de frequência são
armazenados e relacionados. O objetivo é facilitar a manutenção do back-end, a
integração com o front-end e o entendimento das regras aplicadas no banco.

## Tecnologia adotada

O projeto utiliza **SQLite**, acessado pelo módulo nativo `node:sqlite`,
disponível a partir do Node.js 22.5. Essa escolha atende ao escopo do desafio
porque dispensa a instalação de um servidor de banco de dados e mantém os dados
persistidos em um único arquivo.

Por padrão, o arquivo é criado em:

```text
backend/data/engnet.sqlite
```

O caminho pode ser alterado pela variável `DATABASE_PATH` do arquivo `.env`.
O banco local não deve ser enviado ao repositório, pois é gerado novamente na
primeira execução da API.

## Inicialização

Quando o back-end é iniciado, o `DatabaseService` executa três tarefas:

1. Cria o diretório e o arquivo do banco, caso ainda não existam.
2. Cria as tabelas, índices e restrições necessárias.
3. Insere dados iniciais quando a tabela de usuários está vazia.

As chaves estrangeiras são habilitadas com `PRAGMA foreign_keys = ON` e o banco
utiliza o modo `WAL` para melhorar a segurança das operações de leitura e
escrita simultâneas.

## Modelo de dados

O banco é composto por seis tabelas principais.

| Tabela | Responsabilidade |
|---|---|
| `usuarios` | Armazena alunos, professores e administradores. |
| `turmas` | Armazena as turmas e seus professores responsáveis. |
| `turma_alunos` | Registra os alunos vinculados a cada turma. |
| `aulas` | Armazena as aulas realizadas por turma. |
| `frequencias` | Registra presença ou falta de cada aluno em uma aula. |
| `sessoes` | Armazena as sessões usadas na autenticação. |

## Relacionamentos

| Origem | Relação | Destino | Descrição |
|---|---|---|---|
| `usuarios` (professor) | 1:N | `turmas` | Um professor pode ser responsável por várias turmas. |
| `usuarios` (aluno) | N:N | `turmas` | Um aluno pode participar de várias turmas, por meio de `turma_alunos`. |
| `turmas` | 1:N | `aulas` | Uma turma pode possuir várias aulas. |
| `aulas` | 1:N | `frequencias` | Uma aula possui um registro de frequência para cada aluno. |
| `usuarios` (aluno) | 1:N | `frequencias` | Um aluno acumula registros de presença e falta. |
| `usuarios` | 1:N | `sessoes` | Um usuário pode possuir sessões de autenticação. |

## Estrutura das tabelas

### Usuários

| Campo | Tipo | Regra |
|---|---|---|
| `id` | INTEGER | Chave primária gerada automaticamente. |
| `nome` | TEXT | Obrigatório. |
| `email` | TEXT | Obrigatório e único. |
| `matricula` | TEXT | Única quando informada. |
| `senha_hash` | TEXT | Senha armazenada como hash, nunca em texto puro. |
| `perfil` | TEXT | Aceita `aluno`, `professor` ou `administrador`. |
| `foto_url` | TEXT | Opcional. |
| `criado_em` | TEXT | Data de criação preenchida automaticamente. |
| `atualizado_em` | TEXT | Data da última atualização. |

Todos os perfis ficam na mesma tabela. A coluna `perfil` determina quais ações
o usuário pode realizar na API.

### Turmas

| Campo | Tipo | Regra |
|---|---|---|
| `id` | INTEGER | Chave primária gerada automaticamente. |
| `nome` | TEXT | Obrigatório. |
| `codigo` | TEXT | Obrigatório e único. |
| `horario` | TEXT | Obrigatório. |
| `professor_id` | INTEGER | Referência ao professor responsável. |
| `criado_em` | TEXT | Data de criação preenchida automaticamente. |
| `atualizado_em` | TEXT | Data da última atualização. |

### Vínculo entre turmas e alunos

| Campo | Tipo | Regra |
|---|---|---|
| `turma_id` | INTEGER | Referência à turma. |
| `aluno_id` | INTEGER | Referência ao aluno. |
| `vinculado_em` | TEXT | Data do vínculo preenchida automaticamente. |

A chave primária é formada por `turma_id` e `aluno_id`. Assim, o mesmo aluno
não pode ser vinculado duas vezes à mesma turma.

### Aulas

| Campo | Tipo | Regra |
|---|---|---|
| `id` | INTEGER | Chave primária gerada automaticamente. |
| `turma_id` | INTEGER | Referência à turma da aula. |
| `data` | TEXT | Data no formato `AAAA-MM-DD`. |
| `horario` | TEXT | Horário no formato `HH:mm`. |
| `status` | TEXT | Aceita `aberta` ou `finalizada`. |
| `criada_em` | TEXT | Data de criação preenchida automaticamente. |

O conjunto `turma_id`, `data` e `horario` é único. Essa restrição impede que a
mesma aula seja cadastrada mais de uma vez para uma turma.

### Frequências

| Campo | Tipo | Regra |
|---|---|---|
| `id` | INTEGER | Chave primária gerada automaticamente. |
| `aula_id` | INTEGER | Referência à aula. |
| `aluno_id` | INTEGER | Referência ao aluno. |
| `situacao` | TEXT | Aceita `presente` ou `falta`. |
| `registrada_em` | TEXT | Data do registro preenchida automaticamente. |

O conjunto `aula_id` e `aluno_id` é único. Caso uma chamada seja corrigida, o
registro existente é atualizado em vez de criar uma frequência duplicada.

### Sessões

| Campo | Tipo | Regra |
|---|---|---|
| `id` | INTEGER | Chave primária gerada automaticamente. |
| `usuario_id` | INTEGER | Referência ao usuário autenticado. |
| `token_hash` | TEXT | Hash único do token de acesso. |
| `expira_em` | TEXT | Data e horário de expiração. |
| `revogada_em` | TEXT | Preenchido quando o logout é realizado. |
| `criada_em` | TEXT | Data de criação preenchida automaticamente. |

O token original é entregue ao usuário no login, mas somente seu hash é
persistido no banco. Isso reduz a exposição das sessões caso o arquivo seja
acessado indevidamente.

## Regras de integridade

- E-mail, matrícula e código de turma não podem se repetir.
- Um aluno não pode ser vinculado duas vezes à mesma turma.
- Uma turma não pode possuir aulas repetidas na mesma data e horário.
- Um aluno possui apenas uma situação de frequência por aula.
- A exclusão de uma turma remove seus vínculos e suas aulas relacionadas.
- A exclusão de uma aula remove seus registros de frequência.
- Apenas aulas finalizadas entram no histórico e no cálculo da frequência.
- Percentuais menores que `75%` são classificados como baixa frequência.
- Exatamente `75%` é considerado frequência regular.

O registro da chamada é feito dentro de uma transação. Se ocorrer um erro ao
salvar qualquer aluno, toda a operação é desfeita para evitar uma chamada
parcial.

## Dados iniciais

Na primeira execução, o sistema cria dados para desenvolvimento:

| Perfil | Quantidade | Identificação |
|---|---:|---|
| Administrador | 1 | `admin@engnet.com` |
| Professor | 1 | `professor@engnet.com` |
| Alunos | 10 | `aluno01@engnet.com` até `aluno10@engnet.com` |
| Turmas | 2 | Cinco alunos vinculados a cada turma. |

Todos os usuários iniciais utilizam a senha `123456`. Esses dados servem apenas
para desenvolvimento e demonstração do desafio.

## Configuração

As configurações relacionadas ao banco ficam no arquivo `backend/.env`:

```env
DATABASE_PATH=./data/engnet.sqlite
LOW_ATTENDANCE_THRESHOLD=75
AUTH_TOKEN_EXPIRATION_HOURS=8
```

Para recriar o banco durante o desenvolvimento, basta encerrar a API, remover o
arquivo `backend/data/engnet.sqlite` e iniciar o back-end novamente. Essa ação
apaga todos os registros locais e executa novamente a carga inicial.

## Localização da implementação

| Arquivo | Responsabilidade |
|---|---|
| `backend/src/database/database.module.js` | Disponibiliza o serviço de banco aos módulos. |
| `backend/src/database/database.service.js` | Cria o esquema e concentra as operações SQL. |
| `backend/.env.example` | Documenta as variáveis de configuração. |
| `backend/CONTRATO_API.md` | Documenta as rotas que utilizam os dados. |

## Histórico de Versão

| Versão | Data | Descrição | Autor(es) |
|---|---|---|---|
| 1.0 | 14/06/2026 | Criação da documentação do banco SQLite e do modelo de dados atual. | Enzo Menali |
