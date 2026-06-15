# Product Backlog

## Introdução

O Product Backlog é uma lista priorizada dos itens de desenvolvimento derivados das [Histórias de Usuário](./historias_usuario.md) do **ClassHub**. Ele orienta o trabalho da equipe conforme o valor entregue ao usuário e os objetivos do produto.

---

## Critérios de Priorização

| Prioridade | Descrição |
|---|---|
| **Alta** | Funcionalidades essenciais para o funcionamento básico do sistema. |
| **Média** | Funcionalidades importantes, porém não críticas |
| **Baixa** | Melhorias, funcionalidades complementares ou futuras evoluções. |

---

## Backlog Completo

| ID | Título | HU | Descrição | Prioridade | Critérios de Aceitação | Dependências | RF Origem |
|---|---|---|---|---|---|---|---|
| PB01 | Login de Usuário | HU01 | Tela de login com autenticação por e-mail e senha para usuários autorizados. | Alta | Campos de e-mail e senha validados; bloqueio para credenciais inválidas; redirecionamento ao dashboard após sucesso. | Nenhuma | RF01 |
| PB02 | Logout de Usuário | HU02 | Mecanismo para encerramento seguro de sessão. | Alta | Botão de logout visível; sessão encerrada e redirecionamento para login; bloqueio de páginas protegidas após logout. | PB01 | RF02 |
| PB03 | Controle de Acesso a Dados Sensíveis | HU04 | Restrição de acesso a dados sensíveis apenas para usuários autenticados. | Alta | Dados sensíveis inacessíveis sem autenticação; redirecionamento para login ao tentar acessar sem sessão. | PB01 | RF03 |
| PB04 | Edição de Dados Cadastrais | HU03 | Formulário para edição de nome, e-mail, senha e foto de perfil. | Média | Validação de formato de e-mail; confirmação de senha atual para alteração de senha; feedback visual em até 3 segundos. | PB01 | RF04 |
| PB05 | Diferenciação de Perfis de Acesso | HU04 | Controle de perfis: aluno, professor e administrador com permissões distintas. | Alta | Identificação de perfil no login; menus e ações adaptados ao perfil; perfis testados individualmente. | PB01 | RF05 |
| PB06 | Indicadores e Gráficos do Dashboard | HU05 | Cards de indicadores para professor e administrador, com gráficos adicionais no dashboard administrativo. | Alta | Valores calculados automaticamente; gráficos administrativos exibidos quando houver registros; professor limitado às próprias turmas. | PB05 | RF06, RF07, RF08, RF24 |
| PB07 | Alertas de Baixa Frequência | HU06 | Seção no dashboard listando alunos abaixo do limite mínimo de frequência. | Alta | Lista exibe nome, turma e percentual de presença; dados recarregados ao abrir ou atualizar o dashboard; acesso limitado às turmas autorizadas. | PB06 | RF09 |
| PB08 | Criação de Turmas | HU07 | Formulário administrativo para cadastrar turmas e definir o professor responsável. | Alta | Campos obrigatórios validados; professor ativo; código único; confirmação visual em até 3 segundos. | PB05 | RF10 |
| PB09 | Edição de Turmas | HU08 | Funcionalidade administrativa para editar informações e o professor responsável. | Alta | Dados validados; alterações persistidas; confirmação visual em até 3 segundos. | PB08 | RF11 |
| PB10 | Remoção de Turmas | HU09 | Funcionalidade administrativa para excluir turmas com confirmação prévia. | Média | Diálogo de confirmação; turma removida da listagem; confirmação visual em até 3 segundos. | PB08 | RF12 |
| PB11 | Visualização de Alunos por Turma | HU10 | Tela de detalhes da turma com lista e contagem de alunos vinculados. | Alta | Lista completa de alunos da turma; exibição do contador total de alunos; acessível a partir da listagem de turmas. | PB08 | RF13, RF14 |
| PB12 | Registro de Presença | HU11 | Funcionalidade para o professor registrar presença/falta com data e horário. | Alta | Lista de alunos para marcação individual; data e horário registrados; confirmação visual em até 3 segundos. | PB08, PB11 | RF15, RF16, RF17 |
| PB13 | Histórico de Frequência por Aluno (Professor) | HU12 | Consulta do histórico completo de presenças e faltas de cada aluno. | Alta | Exibe data, horário e status por aula; acessível pela listagem de relatórios do professor. | PB12 | RF18 |
| PB14 | Visualização de Frequência pelo Aluno | HU13 | Tela para o aluno consultar sua própria frequência por turma. | Alta | Exibe percentual de presença por turma; acessível pelo perfil do aluno; dados recarregados ao abrir ou atualizar a tela. | PB12 | RF19 |
| PB15 | Relatório Individual de Frequência | HU14 | Geração de relatório individual com histórico e percentual de presença por aluno. | Alta | Dados: nome, turma, histórico e percentual; gerado em até 5 segundos (100 alunos / 30 aulas); seleção de aluno para geração. | PB12 | RF20, RF21 |
| PB16 | Relatório de Alunos com Baixa Frequência | HU15 | Relatório listando alunos com frequência inferior a 75%. | Alta | Lista com nome, turma e percentual; gerado em até 5 segundos; dados limitados conforme o perfil. | PB12 | RF22 |
| PB17 | Relatório de Frequência por Turma | HU16 | Relatório com o histórico de frequência das aulas de uma turma. | Média | Histórico da turma exibido; acesso limitado conforme o perfil; geração em até 5 segundos. | PB12 | RF23 |
| PB18 | Busca de Alunos | HU17 | Campo de busca de alunos nas listagens disponíveis ao usuário. | Média | Pesquisa por nome, matrícula ou e-mail; resultados atualizados conforme o texto digitado. | PB11 | RF25 |
| PB19 | Modo Claro/Escuro | HU18 | Opção para alternar entre tema claro e escuro na interface. | Baixa | Alternância visível e acessível; preferência salva para sessões futuras; todos os elementos adaptados ao tema. | Nenhuma | RF26 |
| PB20 | Gerenciamento de Alunos | HU19 | Cadastro, edição, desativação e redefinição de senha de alunos pelo administrador. | Alta | E-mail e matrícula únicos; edição persistida; usuário desativado sem acesso; nova senha aceita no login. | PB05 | RF27, RF28, RF29, RF33 |
| PB21 | Gerenciamento de Professores | HU20 | Cadastro, edição, desativação e redefinição de senha de professores pelo administrador. | Alta | E-mail único; edição persistida; bloqueio de desativação com turma atribuída; nova senha aceita no login. | PB05 | RF30, RF31, RF32, RF34 |
| PB22 | Gerenciamento de Vínculos da Turma | HU21 | Inclusão e remoção de alunos na composição atual de uma turma. | Alta | Apenas alunos ativos vinculados; vínculo duplicado bloqueado; desvínculo sem apagar histórico anterior. | PB08, PB20 | RF35, RF36 |
| PB23 | Atribuição e Transferência de Professor | HU22 | Definição e alteração do professor responsável por uma turma. | Alta | Professor selecionado deve estar ativo; turma atualizada; permissões transferidas ao novo responsável. | PB08, PB21 | RF37, RF38 |
| PB24 | Exportação de Relatórios em PDF | HU23 | Download dos relatórios acadêmicos em arquivo PDF. | Média | Disponível nos três tipos de relatório; arquivo PDF válido; permissões de acesso respeitadas. | PB15, PB16, PB17 | RF39 |
| PB25 | Exportação de Relatórios em XLSX | HU24 | Download dos relatórios acadêmicos em planilha Excel. | Média | Disponível nos três tipos de relatório; arquivo XLSX válido e com cabeçalhos; permissões de acesso respeitadas. | PB15, PB16, PB17 | RF40 |

---


## Observações sobre Requisitos Não Funcionais

Os requisitos não funcionais (RNF01–RNF12) são restrições transversais que se aplicam a todos os itens do backlog.

| Código | Categoria | Diretriz |
|---|---|---|
| RNF01 | Responsividade | Layout adaptável para 390px, 768px e 1366px de largura, sem sobreposição de elementos ou rolagem horizontal indevida. |
| RNF02 | Usabilidade | Usuário deve conseguir usar as funções principais em até 10 minutos sem treinamento prévio. |
| RNF03 | Consistência Visual | Paleta de cores, espaçamentos e estilos uniformes em todas as telas (tabelas, formulários, botões e menus). |
| RNF04 | Feedback Visual | Indicação visual de ações de confirmação, envio e exclusão em até 3 segundos. |
| RNF05–RNF07 | Manutenibilidade | Componentes reutilizáveis, código componentizado com separação de responsabilidades e semântica HTML correta. |
| RNF08 | Front-end | Desenvolvido com Next.js, Tailwind CSS e JavaScript. |
| RNF09 | Back-end | Desenvolvido com NestJS e API REST. |
| RNF10 | Banco de Dados | Persistência com SQLite. |
| RNF11 | Desempenho | Relatórios gerados em até 5 segundos para turmas de até 100 alunos e 30 aulas ministradas. |
| RNF12 | Deploy | Front-end publicado na Vercel e API executada em ambiente compatível com NestJS e persistência do SQLite. |

---

## Tabela de Rastreabilidade

Relaciona cada requisito funcional com sua História de Usuário e item do Product Backlog correspondentes.

| Requisito | História de Usuário | Item do Backlog | Título do Item |
|---|---|---|---|
| RF01 | HU01 – Realizar Login | PB01 | Login de Usuário |
| RF02 | HU02 – Realizar Logout | PB02 | Logout de Usuário |
| RF03 | HU04 – Acessar Funcionalidades por Perfil | PB03 | Controle de Acesso a Dados Sensíveis |
| RF04 | HU03 – Editar Dados Cadastrais | PB04 | Edição de Dados Cadastrais |
| RF05 | HU04 – Acessar Funcionalidades por Perfil | PB05 | Diferenciação de Perfis de Acesso |
| RF06 | HU05 – Visualizar Indicadores no Dashboard | PB06 | Indicadores e Gráficos do Dashboard |
| RF07 | HU05 – Visualizar Indicadores no Dashboard | PB06 | Indicadores e Gráficos do Dashboard |
| RF08 | HU05 – Visualizar Indicadores no Dashboard | PB06 | Indicadores e Gráficos do Dashboard |
| RF09 | HU06 – Visualizar Alertas de Baixa Frequência | PB07 | Alertas de Baixa Frequência |
| RF10 | HU07 – Criar Turma | PB08 | Criação de Turmas |
| RF11 | HU08 – Editar Turma | PB09 | Edição de Turmas |
| RF12 | HU09 – Remover Turma | PB10 | Remoção de Turmas |
| RF13 | HU10 – Visualizar Alunos da Turma | PB11 | Visualização de Alunos por Turma |
| RF14 | HU10 – Visualizar Alunos da Turma | PB11 | Visualização de Alunos por Turma |
| RF15 | HU11 – Registrar Presença dos Alunos | PB12 | Registro de Presença |
| RF16 | HU11 – Registrar Presença dos Alunos | PB12 | Registro de Presença |
| RF17 | HU11 – Registrar Presença dos Alunos | PB12 | Registro de Presença |
| RF18 | HU12 – Visualizar Histórico de Frequência do Aluno (Professor) | PB13 | Histórico de Frequência por Aluno (Professor) |
| RF19 | HU13 – Visualizar Própria Frequência (Aluno) | PB14 | Visualização de Frequência pelo Aluno |
| RF20 | HU14 – Gerar Relatório Individual de Frequência | PB15 | Relatório Individual de Frequência |
| RF21 | HU14 – Gerar Relatório Individual de Frequência | PB15 | Relatório Individual de Frequência |
| RF22 | HU15 – Gerar Relatório de Alunos com Baixa Frequência | PB16 | Relatório de Alunos com Baixa Frequência |
| RF23 | HU16 – Gerar Relatório de Frequência por Turma | PB17 | Relatório de Frequência por Turma |
| RF24 | HU05 – Visualizar Indicadores no Dashboard | PB06 | Indicadores e Gráficos do Dashboard |
| RF25 | HU17 – Buscar Alunos | PB18 | Busca de Alunos |
| RF26 | HU18 – Alternar Entre Modo Claro e Escuro | PB19 | Modo Claro/Escuro |
| RF27 | HU19 – Gerenciar Alunos | PB20 | Gerenciamento de Alunos |
| RF28 | HU19 – Gerenciar Alunos | PB20 | Gerenciamento de Alunos |
| RF29 | HU19 – Gerenciar Alunos | PB20 | Gerenciamento de Alunos |
| RF30 | HU20 – Gerenciar Professores | PB21 | Gerenciamento de Professores |
| RF31 | HU20 – Gerenciar Professores | PB21 | Gerenciamento de Professores |
| RF32 | HU20 – Gerenciar Professores | PB21 | Gerenciamento de Professores |
| RF33 | HU19 – Gerenciar Alunos | PB20 | Gerenciamento de Alunos |
| RF34 | HU20 – Gerenciar Professores | PB21 | Gerenciamento de Professores |
| RF35 | HU21 – Gerenciar Vínculos de Alunos | PB22 | Gerenciamento de Vínculos da Turma |
| RF36 | HU21 – Gerenciar Vínculos de Alunos | PB22 | Gerenciamento de Vínculos da Turma |
| RF37 | HU22 – Atribuir Professor à Turma | PB23 | Atribuição e Transferência de Professor |
| RF38 | HU22 – Atribuir Professor à Turma | PB23 | Atribuição e Transferência de Professor |
| RF39 | HU23 – Exportar Relatório em PDF | PB24 | Exportação de Relatórios em PDF |
| RF40 | HU24 – Exportar Relatório em XLSX | PB25 | Exportação de Relatórios em XLSX |

**Cobertura:** todos os 40 requisitos funcionais (RF01–RF40) estão cobertos por ao menos uma história de usuário e um item do backlog.

---

## Histórico de Versão

| Versão | Data | Descrição | Autor(es) |
|---|---|---|---|
| 1.0 | 01/06/2026 | Criação inicial do Product Backlog e tabela de rastreabilidade a partir dos requisitos funcionais elicitados. | [Camila Silva](https://github.com/CamilaSilvaC) |
| 1.1 | 14/06/2026 | Inclusão dos itens administrativos, vínculos, atribuição de professor e exportações, com rastreabilidade até RF40. | Enzo Menali |
| 1.2 | 15/06/2026 | Atualização do dashboard, busca, permissões de turmas, tecnologias e critérios de feedback. | Enzo Menali |
| 1.3 | 15/06/2026 | Correção dos critérios de atualização, nomenclatura de baixa frequência e estratégia de deploy. | Enzo Menali |
