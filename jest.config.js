module.exports = {
  /// ////////////
  // TESTS SETUP
  /// ////////////
  preset: "jest-preset-preact",
  setupFiles: ["./jest.setup.js"],
  cacheDirectory: "./.cache",
  maxWorkers: "80%",
  transform: { "\\.jsx?$": "babel-jest" },
  moduleDirectories: ["node_modules"],
  notify: true,
  roots: ["src", "core", "configurations"],
  slowTestThreshold: 5,
  testMatch: ["**/__tests__/**/*.js?(x)", "**/?(*.)+(spec|test).js?(x)"],
  testPathIgnorePatterns: ["\\\\node_modules\\\\"],
  testURL: "http://localhost:8000",
  verbose: true,
  moduleFileExtensions: ["js", "jsx"],

  /// ////////////
  // COVERAGE SETUP
  /// ////////////
  collectCoverageFrom: ["core/**/*.{js,jsx}", "src/**/*.{js,jsx}", "!**/node_modules/**", "!**/vendor/**"],
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
