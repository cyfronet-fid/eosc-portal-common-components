const mainHeaderConfig = require("../configurations/main-header.beta.config.json");
const mainFooterConfig = require("../configurations/main-footer.development.config.json");
const euInformationConfig = require("../configurations/eu-information.development.json");
const defaultConfiguration = require("../configurations/configuration.development.json");

const environment = {
  mainHeaderConfig,
  mainFooterConfig,
  defaultConfiguration,
  euInformationConfig,
  marketplaceUrl: "https://beta.marketplace.eosc-portal.eu",
  dashboardUrl: "https://eosc-user-dashboard.docker-fid.grid.cyf-kr.edu.pl",
  production: false,
  windowTagName: "eosccommon",
};
exports.environment = environment;

if (!window[environment.windowTagName]) {
  window[environment.windowTagName] = {};
}
