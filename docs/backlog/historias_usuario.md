# Histórias de Usuário

## Introdução

Este documento apresenta as Histórias de Usuário elaboradas a partir dos requisitos funcionais do **ClassHub**. Cada história segue o padrão ágil:

> *Como [tipo de usuário], eu quero [funcionalidade], para [benefício ou objetivo].*

As histórias estão organizadas por épicos, conforme a área funcional do sistema, e possuem critérios de aceitação claros e rastreabilidade aos requisitos funcionais de origem.

---

## Perfis de Usuários (Atores)

| Perfil | Descrição |
|---|---|
| **Aluno** | Estudante matriculado em uma ou mais turmas. Pode visualizar sua própria frequência. |
| **Professor** | Responsável pelo registro de presença nas aulas, visualização de históricos e geração de relatórios. |
| **Administrador** | Gerencia alunos, professores e turmas, acessa todos os relatórios e monitora indicadores do dashboard. |

---

## Épico 1 – Autenticação e Perfis de Acesso

### HU01 – Realizar Login

| Campo | Informação |
|---|---|
| **Descrição** | Como usuário autorizado, eu quero realizar login no sistema, para acessar as funcionalidades protegidas da plataforma. |
| **Critérios de Aceitação** | - O sistema deve exibir uma tela de login com campos de e-mail e senha. <br> - Apenas usuários cadastrados e autorizados devem conseguir acessar o sistema. <br> - Após login bem-sucedido, o usuário deve ser redirecionado para o dashboard principal. <br> - Em caso de credenciais inválidas, o sistema deve exibir uma mensagem de erro clara. |
| **Prioridade** | Alta |
| **Rastreabilidade** | RF01 |

---

### HU02 – Realizar Logout

| Campo | Informação |
|---|---|
| **Descrição** | Como usuário autenticado, eu quero realizar logout do sistema, para encerrar minha sessão com segurança. |
| **Critérios de Aceitação** | - O sistema deve disponibilizar uma opção de logout claramente visível. <br> - Ao fazer logout, a sessão do usuário deve ser encerrada e ele deve ser redirecionado para a tela de login. <br> - Após logout, o acesso a páginas protegidas deve ser bloqueado sem novo login. |
| **Prioridade** | Alta |
| **Rastreabilidade** | RF02 |

---

### HU03 – Editar Dados Cadastrais

| Campo | Informação |
|---|---|
| **Descrição** | Como usuário autenticado, eu quero editar meus próprios dados cadastrais (nome, e-mail, senha e foto), para manter minhas informações atualizadas. |
| **Critérios de Aceitação** | - O sistema deve permitir a edição de nome, e-mail, senha e foto de perfil. <br> - Alterações de senha devem exigir confirmação da senha atual. <br> - O sistema deve validar o formato do e-mail antes de salvar. <br> - As alterações devem ser salvas e refletidas imediatamente no perfil do usuário. |
| **Prioridade** | Média |
| **Rastreabilidade** | RF04 |

---

### HU04 – Acessar Funcionalidades por Perfil

| Campo | Informação |
|---|---|
| **Descrição** | Como administrador do sistema, eu quero que os perfis de acesso (aluno, professor e administrador) sejam diferenciados, para que cada usuário veja apenas o que lhe compete. |
| **Critérios de Aceitação** | - O sistema deve identificar o perfil do usuário (aluno, professor, administrador) no momento do login. <br> - Menus, telas e ações devem ser exibidos conforme o perfil do usuário. <br> - Dados sensíveis devem ser acessíveis apenas a usuários autenticados e autorizados. |
| **Prioridade** | Alta |
| **Rastreabilidade** | RF03, RF05 |

---

## Épico 2 – Dashboard Principal

### HU05 – Visualizar Indicadores no Dashboard

| Campo | Informação |
|---|---|
| **Descrição** | Como administrador ou professor, eu quero visualizar indicadores de frequência no dashboard, para ter uma visão consolidada dos dados aos quais tenho acesso. |
| **Critérios de Aceitação** | - O administrador deve visualizar os totais gerais de alunos e aulas e a taxa média geral de presença. <br> - O professor deve visualizar os totais de alunos e aulas e a taxa média referentes somente às suas turmas. <br> - O dashboard administrativo deve apresentar gráficos de evolução e frequência por turma quando houver registros. |
| **Prioridade** | Alta |
| **Rastreabilidade** | RF06, RF07, RF08, RF24 |

---

### HU06 – Visualizar Alertas de Baixa Frequência

| Campo | Informação |
|---|---|
| **Descrição** | Como professor ou administrador, eu quero visualizar alertas de alunos com baixa frequência no dashboard, para tomar ações preventivas rapidamente. |
| **Critérios de Aceitação** | - O dashboard deve listar os alunos com frequência inferior a 75%. <br> - Cada alerta deve exibir o nome do aluno, turma e percentual de presença atual. <br> - O administrador deve visualizar todos os alunos nessa situação e o professor somente os alunos de suas turmas. <br> - Os dados devem ser recarregados ao abrir ou atualizar o dashboard. |
| **Prioridade** | Alta |
| **Rastreabilidade** | RF09 |

---

## Épico 3 – Gerenciamento de Turmas

### HU07 – Criar Turma

| Campo | Informação |
|---|---|
| **Descrição** | Como administrador, eu quero criar turmas informando nome, código, horário e professor responsável, para organizar os grupos de alunos. |
| **Critérios de Aceitação** | - O sistema deve disponibilizar um formulário com os campos obrigatórios. <br> - O professor responsável deve estar ativo. <br> - O código da turma deve ser único no sistema. <br> - Após a criação, a turma deve aparecer na listagem. <br> - O sistema deve exibir confirmação visual em até 3 segundos após o envio. |
| **Prioridade** | Alta |
| **Rastreabilidade** | RF10 |

---

### HU08 – Editar Turma

| Campo | Informação |
|---|---|
| **Descrição** | Como administrador, eu quero editar as informações e o professor responsável de uma turma, para manter seus dados atualizados. |
| **Critérios de Aceitação** | - O sistema deve permitir editar nome, código, horário e professor responsável. <br> - O código deve continuar único e o professor selecionado deve estar ativo. <br> - As alterações devem ser salvas e refletidas na listagem. <br> - O sistema deve exibir confirmação visual em até 3 segundos após o envio. |
| **Prioridade** | Alta |
| **Rastreabilidade** | RF11 |

---

### HU09 – Remover Turma

| Campo | Informação |
|---|---|
| **Descrição** | Como administrador, eu quero remover uma turma do sistema, para manter a base de dados organizada e sem dados obsoletos. |
| **Critérios de Aceitação** | - O sistema deve solicitar confirmação antes de excluir uma turma. <br> - Após exclusão confirmada, a turma não deve mais aparecer na listagem. <br> - O sistema deve exibir confirmação visual em até 3 segundos após a exclusão. |
| **Prioridade** | Média |
| **Rastreabilidade** | RF12 |

---

### HU10 – Visualizar Alunos da Turma

| Campo | Informação |
|---|---|
| **Descrição** | Como professor ou administrador, eu quero visualizar a lista de estudantes vinculados a cada turma e a quantidade de alunos, para ter controle sobre a composição das turmas. |
| **Critérios de Aceitação** | - A tela de detalhes da turma deve listar todos os alunos vinculados. <br> - Deve exibir a quantidade total de alunos da turma. <br> - A lista deve ser acessível a partir da listagem de turmas. |
| **Prioridade** | Alta |
| **Rastreabilidade** | RF13, RF14 |

---

## Épico 4 – Controle de Frequência

### HU11 – Registrar Presença dos Alunos

| Campo | Informação |
|---|---|
| **Descrição** | Como professor, eu quero registrar a presença dos alunos em uma aula informando data e horário, para manter o controle de frequência da turma. |
| **Critérios de Aceitação** | - O sistema deve exibir a lista de alunos da turma para marcação de presença. <br> - O professor deve poder marcar presença ou falta individualmente para cada aluno. <br> - A data e o horário da aula devem ser registrados automaticamente ou informados pelo professor. <br> - O registro deve ser salvo e o sistema deve exibir confirmação visual em até 3 segundos. |
| **Prioridade** | Alta |
| **Rastreabilidade** | RF15, RF16, RF17 |

---

### HU12 – Visualizar Histórico de Frequência do Aluno (Professor)

| Campo | Informação |
|---|---|
| **Descrição** | Como professor, eu quero visualizar o histórico de frequência de cada aluno, para acompanhar a assiduidade e identificar problemas. |
| **Critérios de Aceitação** | - O sistema deve exibir o histórico de presenças e faltas de cada aluno por turma. <br> - O histórico deve mostrar data, horário e status (presente/ausente) de cada aula. <br> - O professor deve conseguir acessar o histórico pela listagem de relatórios, somente para alunos de suas turmas. |
| **Prioridade** | Alta |
| **Rastreabilidade** | RF18 |

---

### HU13 – Visualizar Própria Frequência (Aluno)

| Campo | Informação |
|---|---|
| **Descrição** | Como aluno, eu quero visualizar minha própria frequência, para acompanhar minha assiduidade e evitar reprovação. |
| **Critérios de Aceitação** | - O sistema deve exibir o resumo de presenças e faltas do aluno autenticado. <br> - Deve mostrar o percentual de presença por turma. <br> - A visualização deve ser acessível pelo perfil do aluno. |
| **Prioridade** | Alta |
| **Rastreabilidade** | RF19 |

---

## Épico 5 – Relatórios

### HU14 – Gerar Relatório Individual de Frequência

| Campo | Informação |
|---|---|
| **Descrição** | Como professor ou administrador, eu quero gerar relatórios individuais de frequência por aluno com percentual de presença, para documentar e analisar o desempenho de cada estudante. |
| **Critérios de Aceitação** | - O relatório deve conter o nome do aluno, turma, histórico de presenças/faltas e percentual de presença. <br> - O relatório deve ser gerado em até 5 segundos para turmas de até 100 alunos e 30 aulas. <br> - Deve ser possível selecionar o aluno para gerar o relatório individual. |
| **Prioridade** | Alta |
| **Rastreabilidade** | RF20, RF21 |

---

### HU15 – Gerar Relatório de Alunos com Baixa Frequência

| Campo | Informação |
|---|---|
| **Descrição** | Como professor ou administrador, eu quero gerar um relatório com a lista de alunos com frequência inferior a 75%, para identificar estudantes que necessitam de atenção. |
| **Critérios de Aceitação** | - O relatório deve listar os alunos com frequência inferior a 75%. <br> - Deve exibir nome do aluno, turma e percentual atual de presença. <br> - O relatório deve ser gerado em até 5 segundos. |
| **Prioridade** | Alta |
| **Rastreabilidade** | RF22 |

---

### HU16 – Gerar Relatório de Frequência por Turma

| Campo | Informação |
|---|---|
| **Descrição** | Como professor ou administrador, eu quero gerar relatórios com o histórico de frequência por turma, para acompanhar os registros realizados em cada aula. |
| **Critérios de Aceitação** | - O relatório deve exibir o histórico de frequência das aulas da turma. <br> - O professor deve acessar apenas relatórios de suas turmas. <br> - O relatório deve ser gerado em até 5 segundos para turmas de até 100 alunos e 30 aulas. |
| **Prioridade** | Média |
| **Rastreabilidade** | RF23 |

---

## Épico 6 – Busca e Filtros

### HU17 – Buscar Alunos

| Campo | Informação |
|---|---|
| **Descrição** | Como professor ou administrador, eu quero buscar alunos por nome, matrícula ou e-mail nas listagens às quais tenho acesso, para localizar rapidamente um estudante. |
| **Critérios de Aceitação** | - O campo de busca deve considerar nome, matrícula e e-mail. <br> - O professor deve pesquisar somente alunos das turmas às quais possui acesso. <br> - A listagem deve ser atualizada conforme o texto pesquisado. |
| **Prioridade** | Média |
| **Rastreabilidade** | RF25 |

---

## Épico 7 – Preferências de Interface

### HU18 – Alternar Entre Modo Claro e Escuro

| Campo | Informação |
|---|---|
| **Descrição** | Como usuário do sistema, eu quero alternar entre modo claro e modo escuro, para personalizar minha experiência visual conforme minha preferência. |
| **Critérios de Aceitação** | - O sistema deve disponibilizar uma opção visível para alternar entre modo claro e escuro. <br> - A preferência deve ser salva e mantida nas próximas sessões do usuário. <br> - Todos os elementos da interface devem se adaptar corretamente ao modo selecionado. |
| **Prioridade** | Baixa |
| **Rastreabilidade** | RF26 |

---

## Épico 8 – Administração de Usuários e Turmas

### HU19 – Gerenciar Alunos

| Campo | Informação |
|---|---|
| **Descrição** | Como administrador, eu quero cadastrar, editar, desativar e redefinir a senha de alunos, para manter os usuários acadêmicos atualizados e com acesso controlado. |
| **Critérios de Aceitação** | - O administrador deve cadastrar aluno com nome, e-mail, matrícula e senha. <br> - E-mail e matrícula não podem se repetir. <br> - O administrador deve editar os dados do aluno. <br> - A desativação deve impedir novos logins e encerrar vínculos ativos. <br> - O administrador deve conseguir definir uma nova senha. |
| **Prioridade** | Alta |
| **Rastreabilidade** | RF27, RF28, RF29, RF33 |

---

### HU20 – Gerenciar Professores

| Campo | Informação |
|---|---|
| **Descrição** | Como administrador, eu quero cadastrar, editar, desativar e redefinir a senha de professores, para controlar quem pode administrar as aulas e frequências. |
| **Critérios de Aceitação** | - O administrador deve cadastrar professor com nome, e-mail e senha. <br> - O e-mail não pode se repetir. <br> - O administrador deve editar os dados do professor. <br> - Um professor com turmas atribuídas não pode ser desativado. <br> - A desativação deve impedir novos logins. <br> - O administrador deve conseguir definir uma nova senha. |
| **Prioridade** | Alta |
| **Rastreabilidade** | RF30, RF31, RF32, RF34 |

---

### HU21 – Gerenciar Vínculos de Alunos

| Campo | Informação |
|---|---|
| **Descrição** | Como professor ou administrador, eu quero vincular e desvincular alunos de uma turma, para manter sua composição de acordo com as matrículas atuais. |
| **Critérios de Aceitação** | - Apenas alunos ativos podem ser vinculados. <br> - O mesmo aluno não pode possuir dois vínculos ativos com a mesma turma. <br> - O desvínculo deve remover o aluno da lista atual sem apagar o histórico já registrado. |
| **Prioridade** | Alta |
| **Rastreabilidade** | RF35, RF36 |

---

### HU22 – Atribuir Professor à Turma

| Campo | Informação |
|---|---|
| **Descrição** | Como administrador, eu quero atribuir e transferir uma turma entre professores, para definir corretamente o responsável por suas aulas. |
| **Critérios de Aceitação** | - Toda turma deve possuir um professor ativo. <br> - O administrador deve selecionar o professor no cadastro da turma. <br> - O administrador deve conseguir transferir a turma para outro professor ativo. <br> - Após a transferência, somente o novo responsável deve registrar chamadas da turma. |
| **Prioridade** | Alta |
| **Rastreabilidade** | RF37, RF38 |

---

## Épico 9 – Exportação de Relatórios

### HU23 – Exportar Relatório em PDF

| Campo | Informação |
|---|---|
| **Descrição** | Como professor ou administrador, eu quero baixar relatórios em PDF, para compartilhar ou imprimir os dados de frequência. |
| **Critérios de Aceitação** | - A exportação deve estar disponível para relatórios individuais, de turma e de baixa frequência. <br> - O arquivo deve ser baixado com extensão `.pdf`. <br> - O conteúdo deve respeitar as permissões do usuário autenticado. |
| **Prioridade** | Média |
| **Rastreabilidade** | RF39 |

---

### HU24 – Exportar Relatório em XLSX

| Campo | Informação |
|---|---|
| **Descrição** | Como professor ou administrador, eu quero baixar relatórios em XLSX, para organizar e analisar os dados em uma planilha. |
| **Critérios de Aceitação** | - A exportação deve estar disponível para relatórios individuais, de turma e de baixa frequência. <br> - O arquivo deve ser baixado com extensão `.xlsx`. <br> - As planilhas devem possuir cabeçalhos identificáveis e respeitar as permissões do usuário autenticado. |
| **Prioridade** | Média |
| **Rastreabilidade** | RF40 |

---

## Histórico de Versão

| Versão | Data | Descrição | Autor(es) |
|---|---|---|---|
| 1.0 | 01/06/2026 | Criação inicial das Histórias de Usuário a partir dos requisitos funcionais elicitados. | [Camila Silva](https://github.com/CamilaSilvaC)|
| 1.1 | 14/06/2026 | Inclusão das histórias de administração de usuários, vínculos, atribuição de professor e exportação de relatórios. | Enzo Menali |
| 1.2 | 15/06/2026 | Alinhamento das permissões de turmas, gráficos do dashboard, busca e tempo de feedback. | Enzo Menali |
| 1.3 | 15/06/2026 | Detalhamento dos indicadores por perfil, atualização dos dados e nomenclatura de baixa frequência. | Enzo Menali |
