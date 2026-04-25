const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  {
    ignores: [
      "node_modules/**",
      "playwright-report/**",
      "test-results/**"
    ]
  },
  js.configs.recommended,
  {
    files: ["*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.browser
      }
    },
    rules: {
      "no-alert": "off"
    }
  },
  {
    files: ["eslint.config.js", "vitest.config.js", "playwright.config.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...globals.node
      }
    }
  },
  {
    files: ["app-core.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  {
    files: ["tests/unit/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.vitest
      }
    }
  },
  {
    files: ["tests/component/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.vitest
      }
    }
  },
  {
    files: ["tests/e2e/**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node
      }
    }
  }
];
