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

- **Front-end:** Next.js, Tailwind CSS e JavaScript.
- **Back-end:** NestJS, API REST.
- **Banco de dados:** SQLite.
- **Deploy:** front-end na Vercel e API em ambiente compatível com NestJS e persistência do SQLite.
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
| RF04 | O sistema deve permitir que usuários autenticados editem seus próprios dados cadastrais, como nome, e-mail, senha e foto. | **Should Have** | Importante para a manutenção dos dados dos usuários ao longo do tempo, mas não impede o funcionamento do sistema na primeira versão. |
| RF05 | O sistema deve diferenciar os perfis de acesso da plataforma, como aluno, professor e administrador. | **Must Have** | Requisito estrutural do sistema. Professor precisa registrar presenças, aluno precisa visualizar sua frequência e administrador precisa gerenciar turmas. Sem diferenciação de perfis, não é possível implementar as regras de negócio corretamente. Bloqueia RF13, RF15, RF16, RF18 e RF19. |
| RF06 | O dashboard deve exibir ao administrador a quantidade total de alunos cadastrados e, ao professor, a quantidade de alunos vinculados às suas turmas. | **Must Have** | Componente central do dashboard, respeitando o escopo de dados de cada perfil. |
| RF07 | O dashboard deve exibir ao administrador a quantidade total de aulas cadastradas e, ao professor, a quantidade de aulas de suas turmas. | **Must Have** | Indicador essencial do dashboard e base para o cálculo da taxa de presença, limitado às permissões do usuário. |
| RF08 | O dashboard deve exibir ao administrador a taxa média geral de presença e, ao professor, a taxa média de presença de suas turmas. | **Must Have** | A taxa de presença é o principal indicador acadêmico da plataforma e deve respeitar o escopo de cada perfil. |
| RF09 | O dashboard deve exibir alertas de alunos com frequência inferior a 75%, respeitando as turmas acessíveis ao usuário autenticado. | **Must Have** | Compõe o dashboard obrigatório e permite identificar situações de atenção sem expor turmas não autorizadas. |
| RF10 | O sistema deve permitir que o administrador crie turmas com nome, código, horário e professor responsável. | **Must Have** | Requisito bloqueante do módulo de gerenciamento de turmas. Dependência direta de RF11, RF12, RF13, RF14, RF15 e RF17. |
| RF11 | O sistema deve permitir que o administrador edite as informações das turmas. | **Must Have** | Mantém os dados e o professor responsável atualizados, com controle restrito ao perfil administrativo. |
| RF12 | O sistema deve permitir que o administrador remova turmas. | **Should Have** | Importante para manter a base de dados organizada, mas a ausência não impede o funcionamento do sistema. |
| RF13 | O sistema deve permitir que professores responsáveis e administradores visualizem a lista de estudantes vinculados a cada turma. | **Must Have** | Funcionalidade essencial para o professor realizar o registro de presença (RF15). Sem visibilidade dos alunos por turma, não é possível marcar presença ou falta individualmente. |
| RF14 | O sistema deve exibir a quantidade de alunos vinculados a cada turma para professores responsáveis e administradores. | **Must Have** | Complementa RF13 e apresenta a composição atual da turma aos perfis autorizados. |
| RF15 | O sistema deve permitir que o professor registre a presença dos alunos em uma aula. | **Must Have** | Requisito central e principal funcionalidade do sistema. |
| RF16 | O sistema deve permitir que o professor marque falta para alunos ausentes. | **Must Have** | Complementar e inseparável de RF15. |
| RF17 | O sistema deve registrar a data e o horário da aula. | **Must Have** | Requisito de rastreabilidade obrigatório. Bloqueia RF18, RF20 e RF23. |
| RF18 | O sistema deve permitir que o professor visualize o histórico de frequência de cada aluno. | **Must Have** | Obrigatório para a geração dos relatórios (RF20 e RF22). |
| RF19 | O sistema deve permitir que o aluno visualize a própria frequência. | **Must Have** | Requisito de alto valor para o usuário-aluno. Compõe o escopo de perfis diferenciados (RF05). |
| RF20 | O sistema deve gerar relatório de frequência individual por aluno. | **Must Have** | Componente obrigatório do módulo de relatórios declarado pelo cliente. |
| RF21 | O sistema deve gerar relatório com percentual de presença. | **Must Have** | Requisito obrigatório e dado essencial dos relatórios acadêmicos. |
| RF22 | O sistema deve gerar relatório com a lista de alunos com frequência inferior a 75%. | **Must Have** | Funcionalidade de alto impacto operacional para identificar alunos que exigem acompanhamento. |
| RF23 | O sistema deve gerar relatório com histórico de frequência por turma. | **Must Have** | Requisito obrigatório do módulo de relatórios. |
| RF24 | O sistema deve exibir gráficos de frequência no dashboard para facilitar a análise visual dos dados. | **Could Have** | Diferencial implementado no dashboard para complementar os indicadores numéricos e facilitar a leitura da evolução da frequência. |
| RF25 | O sistema deve permitir buscar alunos por nome, matrícula ou e-mail nas listagens disponíveis ao usuário. | **Could Have** | Melhora a localização de estudantes nas listagens sem ampliar o escopo para filtros ainda não implementados. |
| RF26 | O sistema deve permitir que o usuário alterne entre modo claro e modo escuro. | **Could Have** | Classificado pelo cliente como diferencial (extra). Recurso de personalização da interface que agrega conforto visual, mas não impacta o funcionamento do sistema. |
| RF27 | O sistema deve permitir que o administrador cadastre alunos. | **Must Have** | O cadastro é necessário para incluir novos alunos e manter o sistema utilizável depois da carga inicial de demonstração. |
| RF28 | O sistema deve permitir que o administrador edite os dados de alunos. | **Should Have** | Mantém os dados acadêmicos atualizados, mas não bloqueia o registro de frequência de alunos já cadastrados. |
| RF29 | O sistema deve permitir que o administrador desative alunos. | **Should Have** | Evita acessos e vínculos indevidos de alunos que deixaram a instituição, embora o fluxo principal funcione sem essa ação no MVP mínimo. |
| RF30 | O sistema deve permitir que o administrador cadastre professores. | **Must Have** | Novas turmas precisam ser atribuídas a professores cadastrados. Sem esse cadastro, a administração fica limitada aos dados iniciais. |
| RF31 | O sistema deve permitir que o administrador edite os dados de professores. | **Should Have** | Permite corrigir e atualizar informações profissionais sem impedir o funcionamento básico das turmas existentes. |
| RF32 | O sistema deve permitir que o administrador desative professores sem turmas atribuídas. | **Should Have** | Impede acessos de professores inativos e preserva a integridade das turmas, mas não é bloqueante para o registro de frequência. |
| RF33 | O sistema deve permitir que o administrador redefina a senha de um aluno. | **Should Have** | Oferece recuperação administrativa de acesso, porém o fluxo acadêmico continua disponível para usuários com credenciais válidas. |
| RF34 | O sistema deve permitir que o administrador redefina a senha de um professor. | **Should Have** | Reduz bloqueios de acesso por perda de senha, mas não inviabiliza o funcionamento básico do sistema. |
| RF35 | O sistema deve permitir vincular alunos a uma turma. | **Must Have** | É uma dependência direta do registro de presença. Sem alunos vinculados, o professor não consegue realizar a chamada da turma. |
| RF36 | O sistema deve permitir desvincular alunos de uma turma. | **Should Have** | Mantém a composição das turmas correta quando ocorrem transferências ou cancelamentos, sem bloquear o fluxo principal. |
| RF37 | O sistema deve permitir que o administrador atribua uma turma a um professor. | **Must Have** | Define quem pode registrar a chamada e consultar os dados da turma, sendo necessário para aplicar as permissões do professor. |
| RF38 | O sistema deve permitir que o administrador transfira uma turma para outro professor. | **Should Have** | Garante continuidade quando o professor responsável muda, mas não é necessário enquanto a atribuição original permanecer válida. |
| RF39 | O sistema deve permitir exportar relatórios em formato PDF. | **Should Have** | Facilita o compartilhamento e a impressão dos relatórios, enquanto a consulta dos mesmos dados em tela já atende ao objetivo principal. |
| RF40 | O sistema deve permitir exportar relatórios em formato XLSX. | **Should Have** | Permite análise posterior em planilhas, mas não é indispensável para consultar os indicadores e históricos no sistema. |

---

### 3.2 Requisitos Não Funcionais

| ID | Requisito | Categoria | Justificativa |
|---|---|:---:|---|
| RNF01 | O sistema deve se adaptar a telas de 390px, 768px e 1366px de largura, sem sobreposição de elementos, corte de informações essenciais ou rolagem horizontal indevida. | **Must Have** | Responsividade é declarada como funcionalidade obrigatória pelo cliente (desktop, tablet e mobile). |
| RNF02 | O usuário deve ser capaz de realizar as principais funções do sistema em até 10 minutos, sem necessidade de treinamento prévio. | **Must Have** |  Se os usuários não conseguirem operar a plataforma de forma intuitiva, voltarão aos processos manuais, inviabilizando o objetivo do projeto. |
| RNF03 | O sistema deve possuir consistência visual, em que tabelas, formulários, botões e menus sigam a mesma paleta de cores, com espaçamentos, estilos e formatação em todas as telas. | **Must Have** | Requisito de identidade visual e usabilidade. A consistência visual reduz a curva de aprendizado (RNF02) e está diretamente ligada à obrigação de utilizar as cores da empresa no protótipo. |
| RNF04 | Ações de confirmação, envio de formulários e exclusão devem apresentar indicação visual em até 3 segundos. | **Must Have** | Requisito de feedback de interface essencial para evitar duplos cliques, submissões duplicadas e confusão do usuário. |
| RNF05 | O sistema deve utilizar componentes reutilizáveis na interface, como botões, tabelas, cards e formulários. | **Must Have** | Requisito de arquitetura de front-end obrigatório para manutenibilidade. |
| RNF06 | O código deve ser organizado, componentizado e com separação de responsabilidades. | **Must Have** | Requisito técnico de qualidade de código. É pré-condição para a entrega e avaliação do projeto. |
| RNF07 | A interface deve seguir boas práticas de semântica HTML. | **Should Have** | Importante para acessibilidade, mas não impede o funcionamento do sistema. |
| RNF08 | O front-end deve ser desenvolvido com Next.js, Tailwind CSS e JavaScript. | **Must Have** | Restrição tecnológica definida pela equipe e utilizada na implementação atual. |
| RNF09 | O back-end deve ser desenvolvido com NestJS e API REST. | **Must Have** | Restrição tecnológica obrigatória do projeto. Assim como RNF08, é critério de aceite da entrega. NestJS com API REST é a única arquitetura permitida para o back-end. |
| RNF10 | O sistema deve utilizar SQLite para persistência dos dados. | **Must Have** | Requisito bloqueante para as funcionalidades de cadastro, frequência e relatórios. |
| RNF11 | O sistema deve gerar relatórios em até 5 segundos, com turmas de até 100 alunos e 30 aulas ministradas. | **Should Have** | Requisito de desempenho importante, mas seu cumprimento pode ser validado e ajustado após testes com os dados do projeto. |
| RNF12 | O front-end deve ser publicado na Vercel e configurado para consumir uma URL pública da API. O back-end deve ser executado em ambiente compatível com NestJS e persistência do banco SQLite. | **Must Have** | A publicação deve manter a interface acessível e evitar perda de dados causada por ambientes sem armazenamento persistente. |

---

## 4. Resumo Quantitativo

### 4.1 Requisitos Funcionais

| Categoria | Quantidade | Requisitos |
|---|:---:|---|
| **Must Have** | 25 | RF01, RF02, RF03, RF05, RF06, RF07, RF08, RF09, RF10, RF11, RF13, RF14, RF15, RF16, RF17, RF18, RF19, RF20, RF21, RF22, RF23, RF27, RF30, RF35, RF37 |
| **Should Have** | 12 | RF04, RF12, RF28, RF29, RF31, RF32, RF33, RF34, RF36, RF38, RF39, RF40 |
| **Could Have** | 3 | RF24, RF25, RF26 |
| **Won't Have** | 0 | — |
| **Total** | **40** | |

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
| **Must Have** | 25 | 10 | **35** |
| **Should Have** | 12 | 2 | **14** |
| **Could Have** | 3 | 0 | **3** |
| **Won't Have** | 0 | 0 | **0** |
| **Total** | **40** | **12** | **52** |

---

## 5. Conclusão


### 5.1 Principais Riscos e Dependências Identificadas

| Risco / Dependência | Requisitos Afetados | Mitigação |
|---|---|---|
| RF01 (login) é bloqueante de toda a plataforma. | RF02, RF03, RF04, RF05 | Priorizar a implementação da autenticação como primeira sprint. |
| RF05 (perfis) é bloqueante dos módulos de professor e aluno. | RF15, RF16, RF18, RF19 | Definir os perfis antes de implementar as funcionalidades de cada ator. |
| RF10 (criação de turmas) é bloqueante do controle de frequência. | RF11, RF12, RF13, RF14, RF15, RF16, RF17 | Implementar o CRUD de turmas antes do módulo de presença. |
| RF27 e RF30 (cadastro de usuários) sustentam a evolução da base inicial. | RF28, RF29, RF31, RF32, RF33, RF34, RF35, RF37 | Implementar o gerenciamento de usuários antes de depender de novos alunos e professores. |
| RF35 (vínculo de alunos) é bloqueante para o registro da chamada. | RF15, RF16, RF18, RF20, RF21, RF22, RF23 | Garantir que a composição da turma esteja correta antes de criar e finalizar aulas. |
| RF37 (atribuição de professor) define as permissões sobre a turma. | RF15, RF16, RF18, RF23, RF38 | Validar o professor responsável em todas as operações acadêmicas da turma. |
| RF17 (data/horário) é bloqueante dos relatórios históricos. | RF18, RF20, RF23 | Garantir o registro de data/horário desde o primeiro endpoint de presença. |
| RNF10 (banco de dados) é bloqueante de todo o back-end. | Todos os RFs | Configurar o banco antes de implementar qualquer funcionalidade. |
| Stack obrigatória (RNF08, RNF09) impõe curva de aprendizado. | Todo o projeto | Verificar nivelamento da equipe em Next.js e NestJS antes do início. |

---


## 6. Histórico de Versão

| Versão | Data | Descrição | Autor(es) |
|---|---|---|---|
| 1.0 | 01/06/2026 | Elaboração inicial do Documento de Priorização MoSCoW com base nos requisitos funcionais e não funcionais elicitados. |[Camila Silva](https://github.com/CamilaSilvaC) |
| 1.1 | 14/06/2026 | Priorização dos requisitos administrativos e das exportações de relatórios incluídos no escopo. | Enzo Menali |
| 1.2 | 15/06/2026 | Atualização de permissões, busca, gráficos, tecnologias, feedback e deploy. | Enzo Menali |
| 1.3 | 15/06/2026 | Detalhamento do dashboard por perfil, baixa frequência e estratégia de publicação da aplicação. | Enzo Menali |
