/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#F0FDFA",
          100: "#CCFBF1",
          200: "#99F6E4",
          300: "#5EEAD4",
          400: "#2DD4BF",
          500: "#0F766E",
          600: "#0C5F58",
          700: "#0A4A44",
        },
        accent: {
          50: "#FAECE7",
          100: "#F5C4B3",
          200: "#F0997B",
          400: "#E06D42",
          500: "#D85A30",
          600: "#B84726",
        },
        ink: "#1E293B",
      },
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};