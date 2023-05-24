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
          slideDown: {
            from: { height: 0 },
            to: { height: "var(--radix-accordion-content-height)" },
          },
          slideUp: {
            from: { height: "var(--radix-accordion-content-height)" },
            to: { height: 0 },
          },
          shimmer: {
            "100%": {
              transform: "translateX(100%)",
            },
          },
        },
        animation: {
          disco: "disco 1.5s linear infinite",
          slideDown: "slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1)",
          slideUp: "slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1)",
        },
        colors: {
          background: {
            primary: "#111",
            secondary: "#1c1c1c",
            dark: "#191919",
          },
          neutral: {
            DEFAULT: "#222222",
            secondary: "#2A2A2A",
            stroke: "#3E3D40",
            disco: "#c0c0ff99",
          },
          primary: "#3F45C0",
          danger: "#f33f3f",
        },
      },
    },
    plugins: [
      function ({ addVariant }) {
        addVariant("child", "& > *");
      },
      function ({ addBase, theme }) {
        function extractColorVars(colorObj, colorGroup = "") {
          return Object.keys(colorObj).reduce((vars, colorKey) => {
            const value = colorObj[colorKey];

            const newVars =
              typeof value === "string"
                ? { [`--color${colorGroup}-${colorKey}`]: value }
                : extractColorVars(value, `-${colorKey}`);

            return { ...vars, ...newVars };
          }, {});
        }

        addBase({
          ":root": extractColorVars(theme("colors")),
        });
      },
      require("tailwindcss-animate"),
      require("tailwind-scrollbar"),
    ],
  };
};
