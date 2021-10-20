const path = require("path");

module.exports = {
  components: "src/**/*.jsx",
  ignore: ["src/**/*.spec.{jsx,js}"],
  skipComponentsWithoutExample: true,
  getExampleFilename(componentPath) {
    return componentPath.replace(/\.jsx?$/, ".examples.md");
  },
  require: [
    // path.join(__dirname, "dist/index.production.min.js"),
    path.join(__dirname, "dist/index.development.min.css"),
  ],
  styleguideDir: "dist/docs",
};
