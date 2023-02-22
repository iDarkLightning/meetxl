const withNextra = require("nextra")({
  theme: "./theme.tsx",
});

module.exports = withNextra({
  transpilePackages: ["@meetxl/ui"],
  images: {
    domains: ["images.unsplash.com"],
  },
});
