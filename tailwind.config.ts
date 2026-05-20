import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        surface: "#f8fafc",
        background: "#13121b",
        "on-background": "#e4e1ee",
        "on-surface": "#e4e1ee",
        "on-surface-variant": "#c7c4d8",
        "surface-dark": "#13121b",
        "surface-container-low": "#1b1b24",
        "surface-container": "#1f1f28",
        "surface-container-high": "#2a2933",
        "surface-container-highest": "#35343e",
        "surface-variant": "#35343e",
        "outline-variant": "#464555",
        outline: "#918fa1",
        primary: "#c3c0ff",
        "primary-container": "#4f46e5",
        "on-primary-container": "#dad7ff",
        secondary: "#89ceff",
        "secondary-container": "#00a2e6",
        tertiary: "#ffb695",
        error: "#ffb4ab",
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 23, 42, 0.08)",
        "app-modal": "0 24px 80px rgba(0, 0, 0, 0.35)",
      },
      fontFamily: {
        sans: ["Inter", "Arial", "Helvetica", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
