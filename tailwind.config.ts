import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          header: "var(--c-header-bg)",
          primaryBtn: "var(--c-primary-btn-bg)",
          cardFooter: "var(--c-card-footer-bg)",
        },
        app: {
          bg: "var(--c-page-bg)",
          surface: "var(--c-surface)",
          border: "var(--c-border)",
          text: "var(--c-text)",
          muted: "var(--c-text-muted)",
          textOnDark: "var(--c-text-on-dark)",
        },
      },
    },
  },
};

export default config;