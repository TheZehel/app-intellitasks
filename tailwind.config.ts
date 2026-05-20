import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#021B2F",
        surface: "#E6FFFA",
        background: "#021B2F",
        "on-background": "#E8FFFA",
        "on-surface": "#E8FFFA",
        "on-surface-variant": "#A7D8D2",
        "surface-dark": "#021B2F",
        "surface-container-low": "#03263D",
        "surface-container": "#04324B",
        "surface-container-high": "#06415B",
        "surface-container-highest": "#075269",
        "surface-variant": "#06415B",
        "outline-variant": "#0B5F6F",
        outline: "#5AB8B6",
        primary: "#02C39A",
        "primary-container": "#028090",
        "on-primary-container": "#E8FFFA",
        secondary: "#02C39A",
        "secondary-container": "#028090",
        tertiary: "#02C39A",
        error: "#02C39A",
      },
      boxShadow: {
        soft: "0 18px 45px rgba(2, 27, 47, 0.16)",
        "app-modal": "0 24px 80px rgba(2, 27, 47, 0.48)",
      },
      fontFamily: {
        sans: ["Inter", "Arial", "Helvetica", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
