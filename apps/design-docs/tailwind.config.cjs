const preset = require("@meetxl/ui/tailwind.config.cjs");

/** @type {import("tailwindcss").Config} */
module.exports = {
  presets: [preset({ content: ["./src/**/*.{js,ts,jsx,tsx}"] })],
};
