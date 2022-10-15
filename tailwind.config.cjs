/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: {
          primary: "#111",
          secondary: "#151515",
          dark: "#080808",
        },
        accent: {
          primary: "#af42ed",
          secondary: "#222",
          danger: "#F45050",
          stroke: "#3E3D40",
        },
      },
    },
  },
  plugins: [],
};
