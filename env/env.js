const mainHeaderConfig = require("../configurations/main-header.production.config.json");

exports.environment = {
    mainHeaderConfig: mainHeaderConfig.default,
    production: true
}