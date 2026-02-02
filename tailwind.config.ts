import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    screens: {
      xs: "475px",    // Small phones
      sm: "640px",    // Large phones
      md: "768px",    // Tablets
      lg: "1024px",   // Laptops
      xl: "1280px",   // Desktops
      "2xl": "1400px", // Large laptops
      "3xl": "1600px", // Ultra-wide monitors
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        xs: "1.25rem",
        sm: "1.5rem",
        md: "2rem",
        lg: "2.5rem",
        xl: "3rem",
        "2xl": "4rem",
        "3xl": "6rem",
      },
      screens: {
        xs: "475px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
        "3xl": "1600px",
      },
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        accent: {
          DEFAULT: "#6366f1",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#27272a",
          foreground: "#a1a1aa",
        },
        card: {
          DEFAULT: "#18181b",
          foreground: "#fafafa",
        },
        border: "#27272a",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        space: ["var(--font-space-grotesk)", "sans-serif"],
        lausanne: ['"TWK Lausanne"', "sans-serif"],
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        fadeIn: "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.5s ease-out",
        spinY: "spinY 6s linear infinite", // 3D Earth Spin
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // EARTH-AXIS ROTATION
        spinY: {
           "0%": { transform: "rotateY(0deg)" },
           "100%": { transform: "rotateY(360deg)" },
        }
      },
    },
  },
  plugins: [],
};

export default config;
