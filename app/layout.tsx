import type { Metadata } from "next";
import localFont from "next/font/local";
import { LanguageProvider } from "@/lib/useLanguage";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Matheus Louzada",
  description: "Desenvolvedor Fullstack — .NET, C#, React, TypeScript",
};

// Set the theme and language before paint to avoid a flash of the wrong
// color scheme / lang attribute.
const themeScript = `(function(){try{var t=localStorage.getItem('ml-theme');if(!t){t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);var l=localStorage.getItem('ml-lang');document.documentElement.lang=l==='en'?'en':'pt-BR';}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-bg text-fg font-sans overflow-x-hidden`}
      >
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
