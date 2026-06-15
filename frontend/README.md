# Front-end do ClassHub

Esta pasta contém a interface web do ClassHub, desenvolvida com Next.js, React, JavaScript, Tailwind CSS e Recharts. A aplicação possui fluxos específicos para administrador, professor e aluno e consome a API REST do back-end.

## Como rodar

Abra um terminal nesta pasta:

```bash
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

Depois acesse:

```text
http://localhost:3000
```

O arquivo `.env.local` deve definir a URL da API:

```env
NEXT_PUBLIC_API_URL=http://localhost:3333/api
```

## Funcionalidades

- Autenticação e edição do perfil.
- Dashboards adaptados ao perfil autenticado.
- Administração de alunos, professores e turmas.
- Registro de chamadas pelo professor.
- Consulta de frequência pelo aluno.
- Relatórios por aluno e turma, incluindo baixa frequência.
- Exportação em PDF e XLSX.
- Modo claro e escuro.

## Teste de build

```bash
npm run build
```

## Publicação

O front-end pode ser publicado na Vercel. No ambiente publicado, configure `NEXT_PUBLIC_API_URL` com o endereço público do back-end.

## Onde mexer

```text
src/app          # páginas e rotas do Next.js
src/components   # componentes compartilhados da interface
src/contexts     # autenticação e preferência de tema
src/hooks        # carregamento e composição de dados
src/lib/api.js   # cliente centralizado da API
src/utils        # regras auxiliares de perfil e formatação
```
