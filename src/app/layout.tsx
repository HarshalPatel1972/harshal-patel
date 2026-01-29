import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/effects/ThemeProvider";
import { SmoothScroll } from "@/components/effects/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Harshal Patel | Portfolio",
  description: "Creative Developer & Designer crafting digital experiences.",
};

/**
 * Root Layout
 * 
 * RESPONSIVE DESIGN RULES:
 * 1. Always write CSS Mobile-First (e.g., `w-full md:w-1/2`)
 * 2. Use dynamic viewport units (`dvh`, `svh`) for full-screen sections
 * 3. Test on: Mobile → Tablet → Laptop → Desktop → Ultra-wide
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
