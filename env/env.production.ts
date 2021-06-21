import * as mainHeaderConfig from "../configurations/main-header.production.config.json";

export const environment = {
    mainHeaderConfig: (mainHeaderConfig as any).default,
    production: true
}