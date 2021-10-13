const { src, dest, series, parallel } = require("gulp");
const path = require("path");
const parser = require("yargs-parser");
const gulpIf = require("gulp-if");
const sass = require("gulp-sass")(require("sass"));
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const named = require("vinyl-named");
const webpack = require("webpack");
const webpackStream = require("gulp-webpack");
// const gzip = require("gulp-gzip");
const execa = require("execa");
const { webpackConfig } = require("./webpack.helper");
const { validEnvArgv } = require("./validators");
const { validProductionArgv } = require("./validators");
const { COMPONENTS_PATHS } = require("../app");
const { STYLES_PATHS } = require("../app");
const { getSuffixBy } = require("./utils");

const rootPath = path.resolve(__dirname, "../");
exports.buildLib = (argv = process.argv.slice(2)) => {
  const { production, env } = parser(argv);
  const bundleEntries = COMPONENTS_PATHS.map((componentPath) => path.resolve(rootPath, componentPath));
  return series(
    parallel(validProductionArgv(production), validEnvArgv(env)),
    parallel(
      function moveAssets() {
        return src(path.resolve(rootPath, "styles/assets/*")).pipe(dest(path.resolve(rootPath, "dist/assets")));
      },
      function moveFonts() {
        return src(path.resolve(rootPath, "styles/icons/*")).pipe(dest(path.resolve(rootPath, "dist/icons")));
      },
      series(replaceEnvConfig(env), transpileFiles(bundleEntries, production, env)),
      preprocessStyles(production, env)
    )
  );
};

const preprocessStyles = (production, env, browserSync = null) => {
  return parallel(
    series(
      function preprocessStylesToSeparateFiles() {
        return src(STYLES_PATHS.map((stylesPath) => path.resolve(rootPath, stylesPath)))
          .pipe(gulpIf(!production, sourcemaps.init()))
          .pipe(
            sass({
              errLogToConsole: true,
              outputStyle: "compressed",
              includePaths: [rootPath, path.resolve(rootPath, "styles"), "./"],
            }).on("error", sass.logError)
          )
          .pipe(rename({ extname: `.${getSuffixBy(env)}.min.css` }))
          .pipe(gulpIf(!production, sourcemaps.write(".")))
          .pipe(dest(path.resolve(rootPath, "dist")));
      },
      (cb) => {
        if (browserSync) {
          browserSync.stream();
        }
        cb();
      }
    ),
    series(
      function preprocessStylesBundle() {
        return src(path.resolve(rootPath, "styles/index.scss"))
          .pipe(gulpIf(!production, sourcemaps.init()))
          .pipe(
            sass({
              errLogToConsole: true,
              outputStyle: "compressed",
              includePaths: [rootPath, path.resolve(rootPath, "styles"), "./"],
            }).on("error", sass.logError)
          )
          .pipe(rename({ extname: `.${getSuffixBy(env)}.min.css` }))
          .pipe(gulpIf(!production, sourcemaps.write(".")))
          .pipe(dest(path.resolve(rootPath, "dist")));
      },
      (cb) => {
        if (browserSync) {
          browserSync.stream();
        }
        cb();
      }
    )
  );
};
exports.preprocessStyles = preprocessStyles;

function transpileFiles(paths, production, env, bundleName = "index") {
  // const gzipConfig = { gzipOptions: { level: 9 }, skipGrowingFiles: true, append: false };
  function transpileFiles() {
    return (
      src(paths)
        .pipe(named((file) => `${_toName(file.path)}.${getSuffixBy(env)}.min`))
        .pipe(gulpIf(!production, sourcemaps.init()))
        .pipe(webpackStream(webpackConfig(production), webpack))
        .pipe(gulpIf(!production, sourcemaps.write(".")))
        // .pipe(gulpIf(production, gzip(gzipConfig)))
        .pipe(dest(path.resolve(rootPath, "dist")))
    );
  }

  const importsFilePath = path.resolve(rootPath, "dist/app.js");
  function transpileBundle() {
    const imports = paths
      .map((path) => {
        const alias = _toName(path).replace("-", "_");
        return `import {default as ${alias}} from "${path}"; ${alias};`;
      })
      .join("");
    require("fs").writeFileSync(importsFilePath, imports);

    return (
      src(importsFilePath)
        .pipe(gulpIf(!production, sourcemaps.init()))
        .pipe(webpackStream(webpackConfig(production), webpack))
        .pipe(gulpIf(!production, sourcemaps.write(".")))
        // .pipe(gulpIf(production, gzip(gzipConfig)))
        .pipe(rename({ basename: `${bundleName}.${getSuffixBy(env)}.min` }))
        .pipe(dest(path.resolve(rootPath, "dist")))
    );
  }

  return parallel(
    transpileFiles,
    series(transpileBundle, async (cb) => {
      await execa("rm", ["-fR", path.resolve(rootPath, importsFilePath)], { stdio: "inherit" });
      cb();
    })
  );
}

function _toName(path) {
  return path
    .replace(/^.*[\\/]/, "")
    .replace(/\.[^/.]+$/, "")
    .replace(".component", "");
}

function replaceEnvConfig(env) {
  function replaceEnvConfig() {
    return src(path.resolve(rootPath, env))
      .pipe(rename("env.js"))
      .pipe(dest(path.resolve(rootPath, "env")));
  }

  return replaceEnvConfig;
}
