import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "var(--bg-canvas)",
        surface: "var(--bg-surface)",
        "surface-subtle": "var(--bg-subtle)",
        ink: {
          DEFAULT: "var(--text-primary)",
          muted: "var(--text-muted)",
          faint: "var(--text-faint)",
        },
        border: {
          DEFAULT: "var(--border-color)",
          faint: "var(--border-faint)",
        },
        accent: {
          DEFAULT: "var(--accent-color)",
          hover: "var(--accent-hover)",
          light: "var(--accent-light)",
          foreground: "var(--accent-foreground)",
        },
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        editorial: ["var(--font-editorial)", "Georgia", "serif"],
      },
      borderRadius: {
        pill: "9999px",
        editorial: "1.25rem",
      },
      boxShadow: {
        soft: "0 8px 30px rgba(0, 0, 0, 0.04)",
        card: "0 14px 40px rgba(0, 0, 0, 0.06)",
        glow: "0 0 60px rgba(47, 143, 78, 0.12)",
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.03em",
      },
    },
  },
  plugins: [],
};

export default config;
