const { defineConfig } = require("vitest/config");

module.exports = defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    include: [
      "tests/unit/**/*.test.js",
      "tests/component/**/*.test.js"
    ]
  }
});
