import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/effects/ThemeProvider";
import { SmoothScroll } from "@/components/effects/SmoothScroll";
import { PreloaderWrapper } from "@/components/effects/PreloaderWrapper";
import { BuildTag } from "@/components/ui/BuildTag";
import { HandoffProvider } from "@/lib/handoff-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Harshal Patel | Portfolio",
  description: "Creative Developer & Designer crafting digital experiences.",
};

/**
 * Root Layout
 * 
 * ARCHITECTURE:
 * - PreloaderWrapper: Cinematic intro animation
 * - ThemeProvider: Dark/Light mode switching
 * - SmoothScroll: Lenis-powered smooth scrolling
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          <HandoffProvider>
            <BuildTag />
            <PreloaderWrapper>
              <SmoothScroll>
                {children}
              </SmoothScroll>
            </PreloaderWrapper>
          </HandoffProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
