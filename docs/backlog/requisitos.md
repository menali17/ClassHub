# Requisitos

A partir do problema apresentado pelo cliente, foram definidos os requisitos que orientam o desenvolvimento da solução. Eles ajudam a transformar as necessidades identificadas em funcionalidades, regras e características que o sistema precisa atender.

## Requisitos Funcionais

### Autenticação

| Código | Requisito |
|---|---|
| RF01 | O sistema deve permitir que usuários autorizados realizem login. |
| RF02 | O sistema deve permitir que usuários autenticados realizem logout. |
| RF03 | O sistema deve restringir o acesso a dados sensíveis apenas a usuários autenticados. |
| RF04 | O sistema deve permitir que usuários autenticados editem seus próprios dados cadastrais, como nome, e-mail, senha e foto. |
| RF05 | O sistema deve diferenciar os perfis de acesso da plataforma, como aluno, professor e administrador. |

### Dashboard Principal

| Código | Requisito |
|---|---|
| RF06 | O sistema deve exibir a quantidade total de alunos cadastrados. |
| RF07 | O sistema deve exibir a quantidade total de aulas cadastradas. |
| RF08 | O sistema deve exibir a taxa média geral de presença. |
| RF09 | O sistema deve exibir alertas de alunos com baixa frequência. |

### Gerenciamento de Turmas

| Código | Requisito |
|---|---|
| RF10 | O sistema deve permitir criar turmas com nome, código e horário. |
| RF11 | O sistema deve permitir editar informações de turmas. |
| RF12 | O sistema deve permitir remover turmas. |
| RF13 | O sistema deve permitir visualizar a lista de estudantes vinculados a cada turma. |
| RF14 | O sistema deve exibir a quantidade de alunos vinculados a cada turma. |

### Controle de Frequência

| Código | Requisito |
|---|---|
| RF15 | O sistema deve permitir que o professor registre a presença dos alunos em uma aula. |
| RF16 | O sistema deve permitir que o professor marque falta para alunos ausentes. |
| RF17 | O sistema deve registrar a data e o horário da aula. |
| RF18 | O sistema deve permitir que o professor visualize o histórico de frequência de cada aluno. |
| RF19 | O sistema deve permitir que o aluno visualize a própria frequência. |

### Relatórios

| Código | Requisito |
|---|---|
| RF20 | O sistema deve gerar relatório de frequência individual por aluno. |
| RF21 | O sistema deve gerar relatório com percentual de presença. |
| RF22 | O sistema deve gerar relatório com lista de alunos faltosos. |
| RF23 | O sistema deve gerar relatório com histórico de frequência por turma. |
| RF24 | O sistema deve exibir gráficos de frequência para facilitar a análise visual dos dados. |

### Busca e Filtros

| Código | Requisito |
|---|---|
| RF25 | O sistema deve permitir filtrar e buscar alunos por nome, turma ou situação de frequência. |

### Preferências de Interface

| Código | Requisito |
|---|---|
| RF26 | O sistema deve permitir que o usuário alterne entre modo claro e modo escuro. |

## Requisitos Não Funcionais

### Usabilidade e Interface

| Código | Requisito |
|---|---|
| RNF01 | O sistema deve se adaptar a telas de 390px, 768px e 1366px de largura, sem sobreposição de elementos, corte de informações essenciais ou rolagem horizontal indevida. |
| RNF02 | O usuário deve ser capaz de realizar as principais funções do sistema em até 10 minutos, sem necessidade de treinamento prévio. |
| RNF03 | O sistema deve possuir consistência visual, em que tabelas, formulários, botões e menus sigam a mesma paleta de cores, com espaçamentos, estilos e formatação em todas as telas. |
| RNF04 | Ações de confirmação, envio de formulários e exclusão devem apresentar indicação visual em até 2 segundos. |

### Manutenibilidade

| Código | Requisito |
|---|---|
| RNF05 | O sistema deve utilizar componentes reutilizáveis na interface, como botões, tabelas, cards e formulários. |
| RNF06 | O código deve ser organizado, componentizado e com separação de responsabilidades. |
| RNF07 | A interface deve seguir boas práticas de semântica HTML. |

### Restrições Tecnológicas e Arquitetura

| Código | Requisito |
|---|---|
| RNF08 | O front-end deve ser desenvolvido com Next.js, Tailwind CSS e JavaScript ou TypeScript. |
| RNF09 | O back-end deve ser desenvolvido com NestJS e API REST. |
| RNF10 | O sistema deve possuir persistência de dados com PostgreSQL, MongoDB ou SQLite. |

### Desempenho

| Código | Requisito |
|---|---|
| RNF11 | O sistema deve gerar relatórios em até 5 segundos, com turmas de até 100 alunos e 30 aulas ministradas. |

### Deploy

| Código | Requisito |
|---|---|
| RNF12 | O projeto deve estar publicado em uma plataforma como GitHub Pages, Vercel ou Netlify. |
