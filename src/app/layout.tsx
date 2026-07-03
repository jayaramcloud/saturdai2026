import type { Metadata } from "next";
import TopNav from "@/components/TopNav";
import Sidebar from "@/components/Sidebar";
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
      <body>
        <TopNav />
        <div className="layout-shell">
          <Sidebar />
          <div className="layout-content">{children}</div>
        </div>
      </body>
    </html>
  );
}
