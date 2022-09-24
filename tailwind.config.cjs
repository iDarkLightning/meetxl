/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: {
          primary: "#151515",
          secondary: "#1C1C1C",
          dark: "#080808",
        },
        accent: {
          primary: "#592483",
          secondary: "#252525",
          danger: "#F45050",
          stroke: "#343232",
        },
      },
    },
  },
  plugins: [],
};
