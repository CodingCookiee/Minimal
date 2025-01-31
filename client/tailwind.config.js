/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        generalsans: ["General Sans", "sans-serif"],
        'sf-light': ['SF Pro Text Light', 'sans-serif'],
        'sf-regular': ['SF Pro Text Regular', 'sans-serif'],
        'sf-medium': ['SF Pro Text Medium', 'sans-serif'],
        'sf-semibold': ['SF Pro Text Semibold', 'sans-serif'],
        'sf-bold': ['SF Pro Text Bold', 'sans-serif'],
        'sf-heavy': ['SF Pro Text Heavy', 'sans-serif'],
      },
      colors: {
        'Light-Denim': '#6F8FAF',
        'Medium-Denim': '#4F7CAC',
        'Dark-Denim': '#1B3F8B',
        'Denim-Black': '#2F2F2F',
        'Washed-Black': '#333333',
    
    black: {
          DEFAULT: "#000",
          100: "#010103",
          200: "#0E0E10",
          300: "#1C1C21",
          500: "#3A3A49",
          600: "#1A1A1A",
        },
        white: {
          DEFAULT: "#FFFFFF",
          800: "#E4E4E6",
          700: "#D6D9E9",
          600: "#AFB0B6",
          500: "#62646C",
        },
        light: {
          primary: "#FFFFFF",
          secondary: "#F0F2FA",
          text: "#1A1A1A",
          accent: "#5724ff",
        },
        dark: {
          primary: "#0E0E10",
          secondary: "#1C1C21",
          text: "#FFFFFF",
          accent: "#edff66",
        },
      },
      backgroundImage: {
        terminal: "url('/assets/terminal.png')",
      },
    },
  },
  plugins: [],
}
