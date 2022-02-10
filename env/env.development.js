const mainHeaderConfig = require("../configurations/main-header.development.config.json");
const mainFooterConfig = require("../configurations/main-footer.development.config.json");
const euInformationConfig = require("../configurations/eu-information.development.json");
const defaultConfiguration = require("../configurations/configuration.development.json");

const environment = {
  mainHeaderConfig,
  mainFooterConfig,
  defaultConfiguration,
  euInformationConfig,
  production: false,
  windowTagName: "eosccommon",
};
exports.environment = environment;

if (!window[environment.windowTagName]) {
  window[environment.windowTagName] = {};
}
