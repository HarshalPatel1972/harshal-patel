import type { Metadata } from "next";
import { Inter, Oswald, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/ui/Cursor";
import ImageGuard from "@/components/ui/ImageGuard";


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

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700", "800", "900"]
});

export const metadata: Metadata = {
  title: "Portfolio by Harshal Patel",
  description: "Exorcising technical debt and Constructing High-Performance Systems. Software Engineer Portfolio.",
  keywords: ["Software Engineer", "Go", "TypeScript", "WebAssembly", "Portfolio"],
  authors: [{ name: "Harshal Patel" }],
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${oswald.variable} ${jetbrainsMono.variable} ${playfair.variable} font-sans antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <ImageGuard />
        {children}
      </body>
    </html>
  );
}
