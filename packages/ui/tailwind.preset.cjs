const { relative, join } = require("path");

/** @type {import('tailwindcss').Config} */
module.exports = function tailwindConfig({ content }) {
  return {
    content: [
      ...content,
      join(relative(process.cwd(), __dirname), "./src/**/*.{js,ts,jsx,tsx}"),
    ],
    theme: {
      extend: {
        keyframes: {
          disco: {
            from: {
              transform: "translateY(-50%) rotate(0deg)",
            },
            to: {
              transform: "translateY(-50%) rotate(360deg)",
            },
          },
        },
        animation: {
          disco: "disco 1.5s linear infinite",
        },
        colors: {
          background: {
            primary: "#111",
            secondary: "#1c1c1c",
            dark: "#191919",
          },
          accent: {
            primary: "#3f45c0",
            secondary: "#222",
            danger: "#f33f3f",
            stroke: "#3E3D40",
          },
        },
      },
    },
    plugins: [
      function ({ addVariant }) {
        addVariant("child", "& > *");
      },
      require("tailwindcss-animate"),
    ],
  };
};
