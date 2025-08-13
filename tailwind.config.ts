// tailwind.config.ts
import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography"; // ← add this (see step 2)

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./posts/**/*.{ts,tsx}", // ← add this line
  ],
  theme: {
    extend: {
      colors: {
        paper: "#ffffff",
        ink: "#0b1220",
        muted: "#6b7280",
        border: "#e5e7eb",
        accent: "#111827",
      },
      fontFamily: {
        ui: [
          "ui-sans-serif",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,0.06), 0 1px 3px rgba(16,24,40,0.1)",
      },
      // optional: nicer default prose colors in light mode
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "#3b3b3b",
            "--tw-prose-headings": "#111827",
            "--tw-prose-bullets": "#9ca3af",
            "--tw-prose-links": "#111827",
            "--tw-prose-quotes": "#111827",
          },
        },
      },
    },
  },
  plugins: [typography], // ← enable plugin
} satisfies Config;
