/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: {
          primary: "#070B12",
          secondary: "#12131C",
          dark: "#080808",
        },
        accent: {
          primary: "#328ec6",
          secondary: "#1F1E25",
          danger: "#F45050",
          stroke: "#3E3D40",
        },
      },
    },
  },
  plugins: [],
};
