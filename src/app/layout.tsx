import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SaturdAI - AI Training Platform",
  description: "Learn AI development and master modern AI tools",
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
