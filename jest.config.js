/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

const { environment } = require("./env/env");

module.exports = {
  /// ////////////
  // TESTS SETUP
  /// ////////////
  cacheDirectory: "./.cache",
  clearMocks: true,
  maxWorkers: "80%",
  moduleDirectories: ["node_modules"],
  notify: true,
  roots: ["src", "lib", "configurations"],
  slowTestThreshold: 5,
  testMatch: ["**/__tests__/**/*.js?(x)", "**/?(*.)+(spec|test).js?(x)"],
  testPathIgnorePatterns: ["\\\\node_modules\\\\"],
  testURL: "http://localhost:3000",
  verbose: true,
  moduleFileExtensions: ["js", "jsx", "json", "node"],
  moduleNameMapper: {
    "^react$": "preact/compat",
    "^react-dom/test-utils$": "preact/test-utils",
    "^react-dom$": "preact/compat",
    "^react/jsx-runtime$": "preact/jsx-runtime",
  },

  /// ////////////
  // COVERAGE SETUP
  /// ////////////
  collectCoverageFrom: ["lib/**/*.{js,jsx}", "src/**/*.{js,jsx}", "!**/node_modules/**", "!**/vendor/**"],
  coverageDirectory: "coverage",
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 60,
      lines: 70,
      statements: -10,
    },
  },
  displayName: {
    name: "EOSC Portal Commons",
    color: "blue",
  },
};
