import "./globals.css";

export const metadata = {
  title: "EngNet Presenca",
  description: "Sistema de gestao de presenca academica para aulas praticas.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
