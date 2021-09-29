const path = require("path");
const log = require("fancy-log");
const fs = require("fs");

const validRequired = (params, ...keys) => {
  function validRequired(cb) {
    const missingParam = keys.find((key) => !params[key]);
    if (missingParam) {
      log(`${missingParam} param is missing`);
      log(`
        To get more knowledge about params please see documentation under URL:\n
        - https://github.com/cyfronet-fid/eosc-portal-common#development
        - https://github.com/cyfronet-fid/eosc-portal-common#building
      `);
    }
    cb();
  }
  return validRequired;
};
exports.validRequired = validRequired;

const validProductionArgv = (production) => {
  function validProductionArgv(cb) {
    const isValid = production === true || production === undefined;
    if (isValid) {
      cb();
      return;
    }

    log(`
      To get more knowledge about params please see documentation under URL:\n
      - https://github.com/cyfronet-fid/eosc-portal-common#development
      - https://github.com/cyfronet-fid/eosc-portal-common#building
    `);
    log("Production param is only a flag and shouldn't have any value");
    process.exit(1);
  }
  return validProductionArgv;
};
exports.validProductionArgv = validProductionArgv;

const rootPath = path.resolve(__dirname, "../");
const validEnvArgv = (envAppRelativePath) => {
  function validEnvArgv(cb) {
    if (!envAppRelativePath || envAppRelativePath.trim() === "") {
      log("A missing env relative path argument.");
      log(`
      To get more knowledge about params please see documentation under URL:\n
      - https://github.com/cyfronet-fid/eosc-portal-common#development
      - https://github.com/cyfronet-fid/eosc-portal-common#building
    `);
      process.exit(1);
    }

    const envAbsolutePath = path.resolve(rootPath, envAppRelativePath);
    try {
      fs.existsSync(envAbsolutePath);
      cb();
    } catch (err) {
      log(`Env path: ${envAbsolutePath} doesn't exist`);
      process.exit(1);
    }
  }
  return validEnvArgv;
};
exports.validEnvArgv = validEnvArgv;

const validDistPathArgv = (distAppRelativePath) => {
  function validDistPathArgv(cb) {
    if (!distAppRelativePath || distAppRelativePath.trim() === "") {
      log("A missing dist relative path argument.");
      log(`
      To get more knowledge about params please see documentation under URL:\n
      - https://github.com/cyfronet-fid/eosc-portal-common#development
      - https://github.com/cyfronet-fid/eosc-portal-common#building
    `);
      process.exit(1);
    }

    const distAbsolutePath = path.resolve(rootPath, distAppRelativePath);
    try {
      fs.existsSync(distAbsolutePath);
      cb();
    } catch (err) {
      log(`Dist path: ${distAbsolutePath} doesn't exist`);
      process.exit(1);
    }
  }
  return validDistPathArgv;
};
exports.validDistPathArgv = validDistPathArgv;
