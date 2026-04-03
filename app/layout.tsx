import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DraftHub — Competitive Match Draft Platform",
  description:
    "Crie lobbies, monte times, faça o map ban completo e organize partidas personalizadas de Valorant.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="antialiased bg-[#030305] text-[#f0ece3] min-h-screen">
        {children}
      </body>
    </html>
  );
}
