import type { Metadata } from "next";
import AuthNavbar from "@/components/auth-navbar";
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
      <body>
        <AuthNavbar />
        {children}
      </body>
    </html>
  );
}
