import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Todo List · Slate Hub",
  description: "A focused Next.js todo list to capture and complete tasks.",
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
