import "./globals.css";

export const metadata = {
  title: "Conecta Proposal",
  description: "Generador de propuestas comerciales de Conecta Consulting"
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
