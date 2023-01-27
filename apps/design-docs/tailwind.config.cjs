const preset = require("@meetxl/ui/tailwind.preset.cjs");

/** @type {import("tailwindcss").Config} */
module.exports = {
  presets: [preset({ content: ["./**/*.{js,ts,jsx,tsx}"] })],
};
