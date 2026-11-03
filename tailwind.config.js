/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        emma: {
          primary: "#2f5bea",
          primaryDark: "#1f3fb0",
          light: "#eaf0ff",
          lighter: "#f4f7ff",
          navy: "#1a2233",
          muted: "#6b7480",
          border: "#e6e9ef",
          green: "#178a4c",
          red: "#c22c2c",
        },
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};