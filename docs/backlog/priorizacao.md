# Priorização MoSCoW

## 1. Visão Geral do Problema

### 1.1 Contexto

Uma instituição de ensino identificou graves problemas no processo atual de controle de frequência em aulas práticas e laboratoriais. Todo o processo é executado manualmente, com listas impressas e registros presenciais, gerando uma série de falhas operacionais que comprometem a confiabilidade dos dados e sobrecarregam os profissionais envolvidos.

### 1.2 Problemas Identificados

| # | Problema |
|---|---|
| 1 | Alunos assinando presença por colegas ausentes (fraude). |
| 2 | Erros humanos no lançamento de frequências no sistema. |
| 3 | Dificuldade para rastrear presenças reais. |
| 4 | Excesso de papel e desperdício de recursos. |
| 5 | Lentidão na geração de relatórios. |
| 6 | Sobrecarga administrativa no controle de turmas e horários. |
| 7 | Falta de organização em turmas com grande volume de estudantes. |

### 1.3 Objetivo do Sistema

Desenvolver uma plataforma web Full Stack que modernize e automatize completamente o gerenciamento de frequência acadêmica, tornando o processo mais confiável, rastreável e eficiente, com as seguintes entregas obrigatórias:

- Dashboard centralizado com indicadores de frequência;
- Gerenciamento digital de turmas e alunos;
- Registro digital de presença por professor;
- Geração automatizada de relatórios;
- Autenticação e controle de acesso por perfis;
- Responsividade para desktop, tablet e mobile;
- Deploy em ambiente de produção.

### 1.4 Restrições do Projeto

- **Front-end:** Next.js, Tailwind CSS, JavaScript/TypeScript.
- **Back-end:** NestJS, API REST.
- **Banco de dados:** PostgreSQL, MongoDB ou SQLite.
- **Deploy:** GitHub Pages, Vercel ou Netlify.
- **Identidade visual:** preto, laranja, rosa, roxo e branco.

---

## 2. Critérios Utilizados para Priorização

A classificação MoSCoW foi baseada nos seguintes critérios, avaliados de forma combinada para cada requisito:

| Critério | Descrição |
|---|---|
| **Valor para o usuário** | Grau de impacto direto na experiência e necessidade do usuário final (professor, aluno, administrador). |
| **Impacto no negócio** | Relevância do requisito para resolver os problemas declarados pelo cliente e atingir os objetivos do sistema. |
| **Dependência técnica** | Se outros requisitos dependem deste para funcionar corretamente (requisitos bloqueantes). |
| **Viabilidade de MVP** | Se o sistema pode ser entregue e utilizado de forma básica sem esse requisito. |
| **Riscos do projeto** | Se a ausência do requisito pode gerar riscos operacionais, de segurança ou de conformidade. |
| **Escopo e prazo** | Complexidade de implementação em relação ao tempo e aos recursos disponíveis. |

### Definição das Categorias

- **Must Have (M):** A ausência inviabiliza a entrega. São requisitos sem os quais o sistema não cumpre seu objetivo mínimo.
- **Should Have (S):** Requisitos de alto valor que deveriam estar na primeira versão, mas cuja ausência não paralisa o funcionamento básico.
- **Could Have (C):** Desejáveis. Agregam valor e qualidade, mas com baixo impacto caso fiquem para versões futuras.
- **Won't Have (W):** Fora do escopo desta versão por baixa prioridade, alta complexidade ou irrelevância ao objetivo central do sistema.

---

## 3. Matriz de Priorização MoSCoW

### 3.1 Requisitos Funcionais

| ID | Requisito | Categoria | Justificativa |
|---|---|:---:|---|
| RF01 | O sistema deve permitir que usuários autorizados realizem login. | **Must Have** | Requisito bloqueante de toda a plataforma. Sem autenticação, nenhuma funcionalidade protegida pode ser acessada. É pré-requisito para RF02, RF03, RF04 e RF05. Diretamente relacionado à necessidade de rastrear presenças reais e evitar fraudes. |
| RF02 | O sistema deve permitir que usuários autenticados realizem logout. | **Must Have** | Componente obrigatório de qualquer sistema com autenticação.  |
| RF03 | O sistema deve restringir o acesso a dados sensíveis apenas a usuários autenticados. | **Must Have** | Requisito de segurança fundamental. Dados de frequência, notas e perfis de alunos são sensíveis.|
| RF04 | O sistema deve permitir que usuários autenticados editem seus próprios dados cadastrais (nome, e-mail, senha e foto). | **Should Have** | Importante para a manutenção dos dados dos usuários ao longo do tempo, mas não impede o funcionamento do sistema na primeira versão. |
| RF05 | O sistema deve diferenciar os perfis de acesso da plataforma (aluno, professor e administrador). | **Must Have** | Requisito estrutural do sistema. Professor precisa registrar presenças, aluno precisa visualizar sua frequência e administrador precisa gerenciar turmas. Sem diferenciação de perfis, não é possível implementar as regras de negócio corretamente. Bloqueia RF13, RF15, RF16, RF18 e RF19. |
| RF06 | O sistema deve exibir a quantidade total de alunos cadastrados. | **Must Have** | Componente central do dashboard, que é uma das funcionalidades obrigatórias do projeto. |
| RF07 | O sistema deve exibir a quantidade total de aulas cadastradas. | **Must Have** | Indicador essencial do dashboard. Permite monitorar o avanço das turmas e é a base para o cálculo da taxa de presença (RF08). Requisito obrigatório conforme especificação do cliente. |
| RF08 | O sistema deve exibir a taxa média geral de presença. | **Must Have** | A taxa de presença é o principal KPI da plataforma, substituindo os relatórios manuais lentos citados pelo cliente. Compõe o dashboard obrigatório. |
| RF09 | O sistema deve exibir alertas de alunos com baixa frequência. | **Must Have** |  Compõe o dashboard obrigatório conforme especificação do cliente. |
| RF10 | O sistema deve permitir criar turmas com nome, código e horário. | **Must Have** | Requisito bloqueante do módulo de gerenciamento de turmas. Dependência direta de RF11, RF12, RF13, RF14, RF15 e RF17. |
| RF11 | O sistema deve permitir editar informações de turmas. | **Must Have** | Compõe o módulo obrigatório de gerenciamento de turmas. |
| RF12 | O sistema deve permitir remover turmas. | **Should Have** | Importante para manter a base de dados organizada, mas a ausência não impede o funcionamento do sistema. |
| RF13 | O sistema deve permitir visualizar a lista de estudantes vinculados a cada turma. | **Must Have** | Funcionalidade essencial para o professor realizar o registro de presença (RF15). Sem visibilidade dos alunos por turma, não é possível marcar presença ou falta individualmente. |
| RF14 | O sistema deve exibir a quantidade de alunos vinculados a cada turma. | **Must Have** | Complementa RF13 e é listado como dado obrigatório de cada turma na especificação do cliente. |
| RF15 | O sistema deve permitir que o professor registre a presença dos alunos em uma aula. | **Must Have** | Requisito central e principal funcionalidade do sistema. |
| RF16 | O sistema deve permitir que o professor marque falta para alunos ausentes. | **Must Have** | Complementar e inseparável de RF15. |
| RF17 | O sistema deve registrar a data e o horário da aula. | **Must Have** | Requisito de rastreabilidade obrigatório. Bloqueia RF18, RF20 e RF23. |
| RF18 | O sistema deve permitir que o professor visualize o histórico de frequência de cada aluno. | **Must Have** | Obrigatório para a geração dos relatórios (RF20 e RF22). |
| RF19 | O sistema deve permitir que o aluno visualize a própria frequência. | **Must Have** | Requisito de alto valor para o usuário-aluno. Compõe o escopo de perfis diferenciados (RF05). |
| RF20 | O sistema deve gerar relatório de frequência individual por aluno. | **Must Have** | Componente obrigatório do módulo de relatórios declarado pelo cliente. |
| RF21 | O sistema deve gerar relatório com percentual de presença. | **Must Have** | Requisito obrigatório e dado essencial dos relatórios acadêmicos. |
| RF22 | O sistema deve gerar relatório com lista de alunos faltosos. | **Must Have** | Funcionalidade de alto impacto operacional. |
| RF23 | O sistema deve gerar relatório com histórico de frequência por turma. | **Must Have** | Requisito obrigatório do módulo de relatórios. |
| RF24 | O sistema deve exibir gráficos de frequência para facilitar a análise visual dos dados. | **Could Have** | Classificado pelo cliente como diferencial (extra). Agrega valor considerável à experiência do usuário, mas os relatórios textuais (RF20–RF23) já cumprem o objetivo funcional.|
| RF25 | O sistema deve permitir filtrar e buscar alunos por nome, turma ou situação de frequência. | **Could Have** | Classificado pelo cliente como diferencial (extra). Melhora a usabilidade em turmas grandes, mas a listagem básica (RF13) já permite o acesso aos dados. |
| RF26 | O sistema deve permitir que o usuário alterne entre modo claro e modo escuro. | **Could Have** | Classificado pelo cliente como diferencial (extra). Recurso de personalização da interface que agrega conforto visual, mas não impacta o funcionamento do sistema. |

---

### 3.2 Requisitos Não Funcionais

| ID | Requisito | Categoria | Justificativa |
|---|---|:---:|---|
| RNF01 | O sistema deve se adaptar a telas de 390px, 768px e 1366px de largura, sem sobreposição de elementos, corte de informações essenciais ou rolagem horizontal indevida. | **Must Have** | Responsividade é declarada como funcionalidade obrigatória pelo cliente (desktop, tablet e mobile). |
| RNF02 | O usuário deve ser capaz de realizar as principais funções do sistema em até 10 minutos, sem necessidade de treinamento prévio. | **Must Have** |  Se os usuários não conseguirem operar a plataforma de forma intuitiva, voltarão aos processos manuais, inviabilizando o objetivo do projeto. |
| RNF03 | O sistema deve possuir consistência visual (paleta de cores, espaçamentos, estilos e formatação uniformes em todas as telas). | **Must Have** | Requisito de identidade visual e usabilidade. A consistência visual reduz a curva de aprendizado (RNF02) e está diretamente ligada à obrigação de utilizar as cores da empresa no protótipo. |
| RNF04 | Ações de confirmação, envio de formulários e exclusão devem apresentar indicação visual em até 2 segundos. | **Must Have** | Requisito de feedback de interface essencial para evitar duplos cliques, submissões duplicadas e confusão do usuário. |
| RNF05 | O sistema deve utilizar componentes reutilizáveis na interface (botões, tabelas, cards e formulários). | **Must Have** | Requisito de arquitetura de front-end obrigatório para manutenibilidade. |
| RNF06 | O código deve ser organizado, componentizado e com separação de responsabilidades. | **Must Have** | Requisito técnico de qualidade de código. É pré-condição para a entrega e avaliação do projeto. |
| RNF07 | A interface deve seguir boas práticas de semântica HTML. | **Should Have** | Importante para acessibilidade, mas não impede o funcionamento do sistema. |
| RNF08 | O front-end deve ser desenvolvido com Next.js, Tailwind CSS e JavaScript ou TypeScript. | **Must Have** | Restrição tecnológica obrigatória do projeto. Não é opcional, é um critério de aceite da entrega.  |
| RNF09 | O back-end deve ser desenvolvido com NestJS e API REST. | **Must Have** | Restrição tecnológica obrigatória do projeto. Assim como RNF08, é critério de aceite da entrega. NestJS com API REST é a única arquitetura permitida para o back-end. |
| RNF10 | O sistema deve possuir persistência de dados com PostgreSQL, MongoDB ou SQLite. | **Must Have** | Requisito bloqueante para qualquer funcionalidade de CRUD. |
| RNF11 | O sistema deve gerar relatórios em até 5 segundos, com turmas de até 100 alunos e 30 aulas ministradas. | **Should Have** | Requisito de desempenho importante, mas seu cumprimento pode ser validado e ajustado após testes com os dados do projeto.. |
| RNF12 | O projeto deve estar publicado em plataforma como GitHub Pages, Vercel ou Netlify. | **Must Have** | Requisito de entrega explícito. O deploy funcional é condição obrigatória de aceite do projeto.|

---

## 4. Resumo Quantitativo

### 4.1 Requisitos Funcionais

| Categoria | Quantidade | Requisitos |
|---|:---:|---|
| **Must Have** | 21 | RF01, RF02, RF03, RF05, RF06, RF07, RF08, RF09, RF10, RF11, RF13, RF14, RF15, RF16, RF17, RF18, RF19, RF20, RF21, RF22, RF23 |
| **Should Have** | 2 | RF04, RF12 |
| **Could Have** | 3 | RF24, RF25, RF26 |
| **Won't Have** | 0 | — |
| **Total** | **26** | |

### 4.2 Requisitos Não Funcionais

| Categoria | Quantidade | Requisitos |
|---|:---:|---|
| **Must Have** | 10 | RNF01, RNF02, RNF03, RNF04, RNF05, RNF06, RNF08, RNF09, RNF10, RNF12 |
| **Should Have** | 2 | RNF07, RNF11 |
| **Could Have** | 0 | — |
| **Won't Have** | 0 | — |
| **Total** | **12** | |

### 4.3 Consolidado Geral

| Categoria | RF | RNF | Total |
|---|:---:|:---:|:---:|
| **Must Have** | 21 | 10 | **31** |
| **Should Have** | 2 | 2 | **4** |
| **Could Have** | 3 | 0 | **3** |
| **Won't Have** | 0 | 0 | **0** |
| **Total** | **26** | **12** | **38** |

---

## 5. Conclusão


### 5.1 Principais Riscos e Dependências Identificadas

| Risco / Dependência | Requisitos Afetados | Mitigação |
|---|---|---|
| RF01 (login) é bloqueante de toda a plataforma. | RF02, RF03, RF04, RF05 | Priorizar a implementação da autenticação como primeira sprint. |
| RF05 (perfis) é bloqueante dos módulos de professor e aluno. | RF15, RF16, RF18, RF19 | Definir os perfis antes de implementar as funcionalidades de cada ator. |
| RF10 (criação de turmas) é bloqueante do controle de frequência. | RF11, RF12, RF13, RF14, RF15, RF16, RF17 | Implementar o CRUD de turmas antes do módulo de presença. |
| RF17 (data/horário) é bloqueante dos relatórios históricos. | RF18, RF20, RF23 | Garantir o registro de data/horário desde o primeiro endpoint de presença. |
| RNF10 (banco de dados) é bloqueante de todo o back-end. | Todos os RFs | Configurar o banco antes de implementar qualquer funcionalidade. |
| Stack obrigatória (RNF08, RNF09) impõe curva de aprendizado. | Todo o projeto | Verificar nivelamento da equipe em Next.js e NestJS antes do início. |

---


## 6. Histórico de Versão

| Versão | Data | Descrição | Autor(es) |
|---|---|---|---|
| 1.0 | 01/06/2026 | Elaboração inicial do Documento de Priorização MoSCoW com base nos requisitos funcionais e não funcionais elicitados. |[Camila Silva](https://github.com/CamilaSilvaC) |