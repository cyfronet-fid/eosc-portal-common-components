const {src, dest, series, parallel} = require('gulp');
const path = require('path');
const del = require('del');
const rename = require('gulp-rename');
const execa = require('execa');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const {STYLES_PATHS} = require("../index");
const {COMPONENTS_PATHS} = require("../index");
const concat = require('gulp-concat');
const {getScssWebpackConfig, getFileNameFrom, getTsWebpackConfig} = require("./utils");
const log = require('fancy-log');
const parser = require("yargs-parser");
const _ = require("lodash");

exports.buildLib = (argv = process.argv.slice(2)) => {
  const parsedParams = getProcessParams(argv);
  const {mode, dist_path: distPath, env} = parsedParams;
  return series(
    validParams(parsedParams, "mode", "dist_path", "env"),
    replaceEnvConfigBy(env),
    removeOldDist(distPath),
    parallel(
      transpileComponentsToSeparateFiles(mode, distPath),
      transpileStylesToSeparateFiles(mode, distPath),
      transpileComponentsBundle(mode, distPath),
      transpileStylesBundle(mode, distPath)
    ),
    deleteWebpackMisc(distPath),
    restoreEnvFiles(mode)
  );
}

/**
 *
 * @param {string} env
 * @param {string} rootPath
 * @return {*}
 */
const replaceEnvConfigBy = (env, rootPath = path.resolve(__dirname, "../")) => {
  function replaceEnvConfig(cb) {
    const envPath = path.resolve(rootPath, 'env');
    if (env === path.resolve(envPath, "env.js")) {
      cb();
      return;
    }

    return src(path.resolve(envPath, `env.js`))
      .pipe(rename('env.temp.js'))
      .pipe(dest(envPath))
      .pipe(src(env))
      .pipe(rename(`env.js`))
      .pipe(dest(envPath));
  }

  return replaceEnvConfig;
}

/**
 *
 * @param {"development"|"production"} mode
 * @param {string} rootPath
 * @return {*}
 */
const restoreEnvFiles = (mode, rootPath = path.resolve(__dirname, "../")) => {
  function restoreEnvFiles(cb) {
    if (mode === "development") {
      cb();
      return;
    }

    const envPath = path.resolve(rootPath, 'env');
    return src(path.resolve(envPath, `env.temp.js`))
      .pipe(rename(`env.js`))
      .pipe(dest(envPath))
      .on('end', (cb) => del(path.resolve(envPath, 'env.temp.js'), cb));
  }

  return restoreEnvFiles;
}

/**
 *
 * @param {string} distPath
 * @return {(function(*): Promise<void>)|*}
 */
const removeOldDist = (distPath) => {
  async function removeOldDist(cb) {
    await execa('rm', ['-fR', `./dist/${distPath}`], {stdio: 'inherit'});
    cb();
  }

  return removeOldDist;
}

/**
 *
 * @param {"development"|"production"} mode
 * @param distPath
 * @param rootPath
 * @return {*}
 */
const transpileComponentsToSeparateFiles = (mode, distPath, rootPath = path.resolve(__dirname, "../")) => {
  function transpileComponentsToSeparateFiles() {
    return webpackStream(
      getTsWebpackConfig(
        mode,
        Object.assign({}, ...COMPONENTS_PATHS
          .map(componentPath => path.resolve(rootPath, componentPath))
          .map(componentPath => ({[getFileNameFrom(componentPath)]: componentPath})))
      ),
      webpack
    )
      .pipe(dest(path.resolve(rootPath, `dist/${distPath}/`)))
  }

  return transpileComponentsToSeparateFiles;
}

/**
 *
 * @param {"development"|"production"} mode
 * @param distPath
 * @param rootPath
 * @return {function(): *}
 */
const transpileStylesToSeparateFiles = (mode, distPath, rootPath = path.resolve(__dirname, "../")) => {
  function transpileScssToSeparateFiles() {
    return webpackStream(
      getScssWebpackConfig(
        mode,
        Object.assign({}, ...STYLES_PATHS
          .map(stylesPath => path.resolve(rootPath, stylesPath))
          .map(stylesPath => ({[getFileNameFrom(stylesPath)]: stylesPath})))
      ),
      webpack
    )
      .pipe(dest(path.resolve(rootPath, `dist/${distPath}/`)));
  }

  return transpileScssToSeparateFiles;
}

/**
 *
 * @param {"development"|"production"} mode
 * @param distPath
 * @param rootPath
 * @return {function(): *}
 */
const transpileComponentsBundle = (mode, distPath, rootPath = path.resolve(__dirname, "../")) => {
  function transpileComponentsBundle() {
    return src(COMPONENTS_PATHS.map(componentPath => path.resolve(rootPath, componentPath)))
      .pipe(concat('bundle.tsx'))
      .pipe(dest(path.resolve(rootPath, `dist/${distPath}/`)))
      .pipe(
        webpackStream(
          getTsWebpackConfig(
            mode,
            {"index": path.resolve(rootPath, `dist/${distPath}/bundle.tsx`)}
          ),
          webpack
        )
      )
      .pipe(dest(path.resolve(rootPath, `dist/${distPath}/`)))
      .on('end', () => del(path.resolve(rootPath, `dist/${distPath}/bundle.tsx`)));
  }

  return transpileComponentsBundle;
}

/**
 *
 * @param {"development"|"production"} mode
 * @param distPath
 * @param rootPath
 * @return {function(): *}
 */
const transpileStylesBundle = (mode, distPath, rootPath = path.resolve(__dirname, '../')) => {
  function transpileStylesBundle() {
    return webpackStream(
      getScssWebpackConfig(
        mode,
        {"index": path.resolve(rootPath, 'styles/index.scss')}
      ),
      webpack
    )
      .pipe(dest(path.resolve(rootPath, `dist/${distPath}/`)));
  }

  return transpileStylesBundle;
}

/**
 *
 * @param distPath
 * @param rootPath
 * @return {function(*=): Promise<string[]> | *}
 */
const deleteWebpackMisc = (distPath, rootPath = path.resolve(__dirname, '../')) => {
  function deleteWebpackMisc(cb) {
    return del([
      path.resolve(rootPath, `dist/${distPath}/*.js`),
      "!" + path.resolve(rootPath, `dist/${distPath}/*.min.js`)
    ], cb);
  }

  return deleteWebpackMisc;
}

const getProcessParams = (argv) => {
  const parsedParams = parser(argv);

  if (!!parsedParams["env"]) {
    parsedParams["env"] = parsedParams["mode"] === "development"
      ? path.resolve(__dirname, `../env/env.js`)
      : path.resolve(__dirname, `../env/env.production.js`);
  }
  else {
    parsedParams["env"] = path.resolve(__dirname, "../" + parsedParams["env"]);
  }

  return parsedParams;
}

const validParams = (parsedParams, ...requiredFields) => {
  function validParams(cb) {
    const hasAllRequired = _.every(
      requiredFields
        .map(requiredKey => Object.keys(parsedParams).includes(requiredKey))
    );
    const ALLOWED_MODES = ["production", "development"];
    if (!hasAllRequired || !ALLOWED_MODES.includes(parsedParams["mode"])) {
      log("You're missing the required fields: " + requiredFields.join(", "));
      log("or mode has other value than development or production")

      // Help message
      log("\n[build_lib] process produce transpiled files to `dist_path` depend on `mode`\n");

      log("--dist_path path where will be available transpiled files under ~/eosc-portal-common-components/dist/<dist_path>")
      log("--mode enum with allowed values 'production'|'development' which will produce different output")

      process.exit(1);
    }

    cb();
  }

  return validParams;
}
