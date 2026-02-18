/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#080B14",
        deep: "#0F172A",
        panel: "#131B2F",
        neon: "#22D3EE",
        mint: "#34D399"
      },
      boxShadow: {
        neon: "0 0 25px rgba(34, 211, 238, 0.35)"
      }
    }
  },
  plugins: []
};
