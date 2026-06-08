# Front-end

Esta pasta contem a interface do sistema, feita com Next.js, JavaScript e Tailwind CSS.

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

## Onde mexer

```text
src/app          # paginas e rotas do Next.js
src/app/page.jsx # primeira pagina exibida no navegador
src/app/globals.css # estilos globais e Tailwind
```

Crie novas pastas dentro de `src/app` conforme as telas forem desenvolvidas.
