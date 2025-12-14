import type { Metadata } from "next";
import { Outfit, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE_CONFIG } from "@/lib/constants";

// 正文字体 - 现代几何感无衬线
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// 标题字体 - 有机感衬线体（带有手工艺质感）
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

// 代码字体
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.name} - Claude Code Skill Marketplace`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
  authors: [{ name: 'AgentSkill Team' }],
  creator: 'AgentSkill',
  metadataBase: new URL(SITE_CONFIG.url),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} - Claude Code Skill Marketplace`,
    description: SITE_CONFIG.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_CONFIG.name} - Claude Code Skill Marketplace`,
    description: SITE_CONFIG.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_CONFIG.url,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${fraunces.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[#FAF7F2] min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
