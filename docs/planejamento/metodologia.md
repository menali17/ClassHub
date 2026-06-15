# Metodologia

Para organizar o desenvolvimento do projeto, a equipe adotou uma abordagem incremental, dividindo o trabalho em etapas menores e revisáveis. Como o desafio simula um cenário real de consultoria e desenvolvimento, a metodologia foi pensada para unir levantamento de requisitos, planejamento, prototipação, implementação e validação da solução.

A ideia é evitar que o projeto comece diretamente pelo código sem antes entender bem o problema. Por isso, a primeira parte do trabalho ficou concentrada em compreender o cenário atual do cliente, identificar as dores do processo manual de frequência e transformar essas necessidades em requisitos.

## Etapas do trabalho

O desenvolvimento foi organizado nas seguintes etapas:

1. **Entendimento do problema**

   A equipe analisou o cenário apresentado pelo cliente, identificando os principais problemas do controle manual de presença, como erros humanos, uso excessivo de papel, dificuldade de rastreamento e lentidão na geração de relatórios.

2. **Levantamento de requisitos**

   A partir do problema identificado, foram definidos os requisitos funcionais e não funcionais do sistema. Essa etapa ajudou a organizar o que a plataforma precisa fazer e quais características devem ser consideradas durante o desenvolvimento.

3. **Definição da solução**

   Com os requisitos levantados, a equipe estruturou a proposta da solução, definindo as principais funcionalidades da plataforma, os usuários envolvidos e as tecnologias previstas para o projeto.

4. **Prototipação da interface**

   Antes da implementação, a equipe representou visualmente as telas principais do sistema. A prototipação ajudou a alinhar o entendimento entre os integrantes e facilitou a validação da navegação, da organização das informações e da identidade visual.

5. **Desenvolvimento incremental**

   A implementação foi feita por partes, priorizando autenticação, dashboard, gerenciamento de turmas, controle de frequência e relatórios. Os diferenciais implementados foram modo escuro, gráficos de frequência e campos de busca.

6. **Validação e ajustes**

   A cada entrega parcial, a equipe deve revisar se a funcionalidade atende aos requisitos definidos. Também devem ser verificados pontos como responsividade, organização visual, feedback para o usuário e funcionamento das principais ações.

## Organização da equipe

A equipe é composta por quatro integrantes, com divisão  entre front-end e back-end:

| Integrante | Frente de atuação |
|---|---|
| Enzo Menali | Back-end |
| André Toussaint | Back-end |
| Camila Silva | Front-end |
| Beatriz Fernandes | Front-end |

Mesmo com essa divisão, as decisões principais devem ser alinhadas em grupo para manter consistência na solução. A separação por frente ajuda a organizar as responsabilidades, mas não impede que os integrantes revisem, discutam e apoiem outras partes do projeto quando necessário.

A comunicação da equipe é realizada pelo Discord, utilizado para alinhamentos rápidos, avisos, dúvidas, reuniões e acompanhamento das tarefas do dia a dia.

Sempre que uma funcionalidade ou documento for alterado, é importante que os demais integrantes tenham visibilidade para evitar retrabalho ou conflitos.

## Controle de versão

O projeto utiliza Git e GitHub para versionamento do código e da documentação. As alterações devem ser feitas em branches específicas, seguindo um padrão de nomenclatura que indique o tipo de mudança realizada.

Sempre que possível, as alterações devem ser enviadas por meio de commits pequenos e descritivos. Isso facilita o acompanhamento do histórico do projeto e ajuda a entender o que foi feito em cada etapa.

## Validação da documentação

Como a documentação do projeto é publicada com MkDocs, as páginas devem ser revisadas localmente antes de serem enviadas para o repositório. Para isso, a equipe pode utilizar:

```bash
mkdocs serve
```

Esse comando permite visualizar a documentação no navegador durante a edição.

Também é recomendado validar o build da documentação com:

```bash
mkdocs build --strict
```

Assim, é possível identificar problemas de navegação, links quebrados ou erros de estrutura antes da publicação.

## Critérios de acompanhamento

Durante o desenvolvimento, a equipe deve acompanhar:

- Se os requisitos definidos estão sendo atendidos.
- Se a interface continua coerente e responsiva.
- Se o código está organizado e componentizado.
- Se as funcionalidades principais estão funcionando corretamente.
- Se a documentação permanece atualizada em relação à solução proposta.
- Se o projeto está pronto para ser publicado e apresentado.

## Histórico de Versão

| Versão | Data | Descrição | Autor(es) |
|---|---|---|---|
| 1.0 | 01/06/2026 | Criação da metodologia, incluindo etapas de trabalho, organização da equipe, comunicação e validação da documentação. | Enzo Menali |
| 1.1 | 15/06/2026 | Atualização das etapas realizadas, diferenciais implementados e comunicação pelo Discord. | Enzo Menali |
