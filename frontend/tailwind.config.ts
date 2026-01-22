import type { Config } from "tailwindcss";

const config: Config & { daisyui?: any } = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        jakarta: [
          "var(--font-plus-jakarta-sans)",
          "Plus Jakarta Sans",
          "sans-serif",
        ],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#f35959",
          "primary-content": "#ffffff",
          secondary: "#f5f5f5",
          "secondary-content": "#1a1a1a",
          accent: "#f5f5f5",
          "accent-content": "#1a1a1a",
          neutral: "#1a1a1a",
          "neutral-content": "#f5f5f5",
          "base-100": "#ffffff",
          "base-200": "#f5f5f5",
          "base-300": "#ebebeb",
          "base-content": "#1a1a1a",
          info: "#3b82f6",
          success: "#10b981",
          warning: "#f59e0b",
          error: "#ef4444",
        },
        dark: {
          primary: "#f35959",
          "primary-content": "#ffffff",
          secondary: "#2a2a2a",
          "secondary-content": "#ffffff",
          accent: "#2a2a2a",
          "accent-content": "#ffffff",
          neutral: "#ffffff",
          "neutral-content": "#1a1a1a",
          "base-100": "#1a1a1a",
          "base-200": "#2a2a2a",
          "base-300": "#3a3a3a",
          "base-content": "#ffffff",
          info: "#3b82f6",
          success: "#10b981",
          warning: "#f59e0b",
          error: "#ef4444",
        },
      },
    ],
  },
};

export default config;
