# Requisitos 

## Requisitos Funcionais

1. RF01 - Autenticação
 - RF01.1 - O sistema deve permitir o login do usuário
 - RF01.2 - O sistema deve permitir logout do usuário

2. RF02 - DashBoard Principal
 - RF02.1 - O sistema deve mostrar a quantidade total de alunos por turma
 - RF02.2 - O sistema deve mostrar a quantidade total de aulas registradas por turma
 - RF02.3 - O sistema deve mostrar a taxa média de presença por turma
 - RF02.4 - O sistema deve emitir alertas de baixa frequência por aluno
 
3. RF03 - Gerenciamento de Turmas
 - RF03.1 - O sistema deve permitir criar turmas com nome, código, horário e quantidade de alunos
 - RF03.2 - O sistema deve permitir editar turmas
 - RF03.3 - O sistema deve permitir excluir turmas
 - RF03.4 - O sistema deve permitir visualizar a lista de estudantes por turma

4. RF04 - Controle de Frequência 

- RF04.1 - O sistema deve permitir registrar a presença dos alunos
- RF04.2 - O sistema deve permitir marcar falta de um aluno
- RF04.3 - O sistema deve permitir registrar data e horário da aula
- RF04,4 - O sistema deve permitir visualizar histório de frequência do aluno

**5. RF05 - Geração de Relatórios**

- RF05.1 -  O sistema deve gerar um relatório de frequência individual por aluno
- RF06.2 - O sistema deve gerar um relatório de percentual de presença
- RF06.3 - O sistema deve gerar um relatório da lista de alunos faltosos
- RF06.4 - O sistema deve gerer um relatório de histório por turma

## Requisitos Não Funcionais

- RNF-01: O sistema deve se adaptar a telas de 390px, 768px e 1366px de largura, sem sobreposição de elementos, corte de informações essenciais ou rolagem horizontal indevida (Responsividade)

- RNF-02: O usuário deve ser capaz de realizar as principais funções do sistema em até 10 minutos, sem necessidade de treinamento prévio(Usabilidade)

- RNF-03: O sistema deve possuir uma consistência visual, em que tabelas, formulários, botões e menus sigam a mesma paleta de cores, com espaçamentos, estilos e formatação em todas as telas

- RNF-04: Ações de confirmação, envio de formulários, exclusão devem apresentar indicação visual em até 2 segundos (Manutelibilidade)

- RNF-05: Componentes como botões, tabelas, cards e formulários devem ser reutilizados

- RNF-06: O sistema deve ser implementado utilizando as tecnologias Next.js, JavaScript/TypeScript e TailWind CSS na parte front-end

- RNF-07: O sistema deve utilizar as tecnologias NestJS, API REST na parte back-end

- RNF-08: O sistema deve utilizar PostGreeSQL, MongoDB ou SQLite para manutenção e persistência de dados

- RNF-09: O sistema deve permitir gerar relatórios em até 5 segundos, com turmas de até 100 alunos e 30 aulas ministradas
