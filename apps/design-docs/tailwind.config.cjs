const preset = require("@meetxl/ui/tailwind.preset.cjs");

/** @type {import("tailwindcss").Config} */
module.exports = {
  presets: [preset({ content: ["./src/**/*.{js,ts,jsx,tsx}"] })],
};
 