const preset = require("@meetxl/ui/tailwind.preset.cjs");

/** @type {import("tailwindcss").Config} */
module.exports = {
  presets: [preset({ content: ["./src/**/*.{js,ts,jsx,tsx}"] })],
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
};
