import type { Metadata } from "next";
import { Inter, Oswald, JetBrains_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/ui/Cursor";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"]
});

export const metadata: Metadata = {
  title: "Harshal Patel — Software Engineer",
  description:
    "Portfolio of Harshal Patel. Building high-performance systems with Go, TypeScript & WebAssembly.",
  keywords: ["Software Engineer", "Go", "TypeScript", "WebAssembly", "Portfolio"],
  authors: [{ name: "Harshal Patel" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${oswald.variable} ${jetbrainsMono.variable} ${cormorantGaramond.variable} font-sans antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <Cursor />
        {children}
      </body>
    </html>
  );
}
