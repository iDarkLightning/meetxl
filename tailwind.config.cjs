/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: {
          primary: "#0b0b0b",
          secondary: "#141414",
          dark: "#080808",
        },
        accent: {
          primary: "#af42ed",
          secondary: "#1F1E25",
          danger: "#F45050",
          stroke: "#3E3D40",
        },
      },
    },
  },
  plugins: [],
};
