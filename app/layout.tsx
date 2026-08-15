import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "slate-hub-0tc0",
  description: "make me a todo-list using nextjs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
