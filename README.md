# ClassHub

Sistema de gestão de presença acadêmica desenvolvido durante o Desafio 4 do Programa Trainee EngNet.

A aplicação permite o gerenciamento de alunos, professores, turmas, aulas e registros de frequência, além da geração de relatórios em PDF e Excel.

---

## Tecnologias utilizadas

### Front-end

* Next.js
* JavaScript
* Tailwind CSS
* HTML semântico

### Back-end

* NestJS
* API REST
* SQLite

### Documentação

* MkDocs

---

## Estrutura do projeto

```text
.
├── frontend/        # Interface da aplicação desenvolvida com Next.js
├── backend/         # API REST desenvolvida com NestJS
├── docs/            # Documentação do projeto
├── mkdocs.yml       # Configuração da documentação
├── package.json     # Scripts da aplicação
└── package-lock.json
```

---

## Funcionalidades

* Autenticação de usuários
* Controle de acesso por perfil
* Cadastro e gerenciamento de alunos
* Cadastro e gerenciamento de professores
* Cadastro e gerenciamento de turmas
* Associação de alunos às turmas
* Registro de presença em aulas
* Consulta de frequência individual
* Dashboard com indicadores acadêmicos
* Relatórios de frequência por aluno
* Relatórios de alunos com baixa frequência
* Relatórios por turma
* Exportação de relatórios em PDF e Excel

---

## Como executar o projeto

### Pré-requisitos

É necessário possuir instalado:

* Node.js 22.5 ou superior
* npm

---

### 1. Clonar o repositório

```bash
git clone https://github.com/menali17/ClassHub.git
cd ClassHub
```

---

### 2. Instalar as dependências

Na raiz do projeto execute:

```bash
npm install
```

Instale também as dependências do front-end e back-end:

```bash
cd frontend
npm install

cd ../backend
npm install

cd ..
```

---

### 3. Configurar variáveis de ambiente

Back-end:

```bash
cd backend
copy .env.example .env
```

Front-end:

```bash
cd frontend
copy .env.example .env.local
```

---

### 4. Executar a aplicação

Com o script configurado na raiz do projeto, basta executar:

```bash
npm run dev
```

O comando iniciará simultaneamente:

* Front-end: http://localhost:3000
* Back-end: http://localhost:3333/api

### 5. Executar as verificações

Na raiz do projeto:

```bash
npm run check
```

Esse comando executa os testes de integração do back-end e o build de produção do front-end.

### Credenciais de desenvolvimento

Todos os usuários iniciais utilizam a senha `123456`.

| Perfil | E-mail |
|---|---|
| Administrador | `admin@engnet.com` |
| Professores | `professor01@engnet.com` até `professor03@engnet.com` |
| Alunos | `aluno01@engnet.com` até `aluno15@engnet.com` |

---

## Organização do desenvolvimento

O projeto utiliza uma estrutura de múltiplos pacotes, permitindo que o front-end e o back-end sejam desenvolvidos separadamente, enquanto a execução durante o desenvolvimento é centralizada por meio do script da raiz do projeto.

---

## Documentação

A documentação do projeto está localizada na pasta:

```text
docs/
```

A configuração do MkDocs está definida no arquivo:

```text
mkdocs.yml
```
