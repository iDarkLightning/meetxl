const { relative, join } = require("path");

/** @type {import('tailwindcss').Config} */
module.exports = function tailwindConfig({ content }) {
  console.log(
    join(relative(process.cwd(), __dirname), "./src/**/*.{js,ts,jsx,tsx}")
  );

  return {
    content: [
      ...content,
      join(relative(process.cwd(), __dirname), "./src/**/*.{js,ts,jsx,tsx}"),
    ],
    // content: ["./src/**/*.{js,ts,jsx,tsx}"] ,
    theme: {
      extend: {
        colors: {
          background: {
            primary: "#111",
            secondary: "#1c1c1c",
            dark: "#191919",
          },
          accent: {
            primary: "#bb71ee",
            secondary: "#222",
            danger: "#F45050",
            stroke: "#3E3D40",
          },
        },
      },
    },
    plugins: [
      function ({ addVariant }) {
        addVariant("child", "& > *");
      },
    ],
  };
};
