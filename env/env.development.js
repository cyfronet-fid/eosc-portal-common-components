const mainHeaderConfig = require("../configurations/main-header.development.config.json");
const mainFooterConfig = require("../configurations/main-footer.development.config.json");
const defaultConfiguration = require("../configurations/configuration.development.json");

const environment = {
  mainHeaderConfig,
  mainFooterConfig,
  defaultConfiguration,
  marketplaceUrl: "http://marketplace.docker-fid.grid.cyf-kr.edu.pl",
  dashboardUrl: "https://eosc-user-dashboard.docker-fid.grid.cyf-kr.edu.pl",
  production: false,
  windowTagName: "eosccommon",
};
exports.environment = environment;

if (!window[environment.windowTagName]) {
  window[environment.windowTagName] = {};
}
