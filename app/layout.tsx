import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IntelliTasks",
  description: "Sistema de gestao de tarefas com categorias",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
