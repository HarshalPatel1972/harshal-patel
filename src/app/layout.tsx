import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk, Anton, Playfair_Display, Inter, EB_Garamond, Montserrat, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/effects/ThemeProvider";
import { SmoothScroll } from "@/components/effects/SmoothScroll";
import { PreloaderWrapper } from "@/components/effects/PreloaderWrapper";
import { HandoffProvider } from "@/lib/handoff-context";
import { ScrollEasterEgg } from "@/components/effects/ScrollEasterEgg";

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

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
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
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${anton.variable} ${playfair.variable} ${inter.variable} ${ebGaramond.variable} ${montserrat.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          <HandoffProvider>
            <ScrollEasterEgg />
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
