const preset = require("./tailwind.preset.cjs");

/** @type {import("tailwindcss").Config} */
module.exports = {
  presets: [preset({ content: [""] })],
};
