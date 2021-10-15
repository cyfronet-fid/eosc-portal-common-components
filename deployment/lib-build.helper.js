const { src, dest, series, parallel } = require("gulp");
const path = require("path");
const parser = require("yargs-parser");
const rename = require("gulp-rename");
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
      series(replaceEnvConfig(env), transpileFiles(bundleEntries, production, env)),
      preprocessStyles(production, env)
    ),
    function removeMisc(cb) {
      const commands = [
        "ls . | grep -P '^.+(?<!\\.min)\\.js$' | xargs -d '\\n' rm",
        "ls . | grep -P '^.+(?<!\\.min)\\.js.map$' | xargs -d '\\n' rm",
        "ls . | grep -P '^.*[0-9].*.js$' | xargs -d '\\n' rm",
      ];
      const cmdOptions = { shell: true, cwd: path.resolve(rootPath, "dist") };
      commands.forEach((cmd) => {
        try {
          execa.commandSync(cmd, cmdOptions).stdout.toString("utf-8");
        } catch (e) {}
      });
      cb();
    }
  );
};

const preprocessStyles = (production, env, browserSync = null) => {
  return parallel(
    series(
      function preprocessStylesToSeparateFiles() {
        return src(STYLES_PATHS.map((stylesPath) => path.resolve(rootPath, stylesPath)))
          .pipe(webpackStream(webpackConfig(production), webpack))
          .pipe(rename({ suffix: `.${getSuffixBy(env)}.min` }))
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
          .pipe(webpackStream(webpackConfig(production), webpack))
          .pipe(rename({ suffix: `.${getSuffixBy(env)}.min` }))
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
        .pipe(named((file) => `${_toName(file.path).replace(".interface", "")}.${getSuffixBy(env)}.min`))
        .pipe(webpackStream(webpackConfig(production), webpack))
        // .pipe(gulpIf(production, gzip(gzipConfig)))
        .pipe(dest(path.resolve(rootPath, "dist")))
    );
  }

  const importsFilePath = path.resolve(rootPath, "dist/app.js");
  function transpileBundle() {
    const imports = paths
      .map((path) => {
        const alias = _toName(path).replace(".interface", "").replace("-", "_");
        return `import {default as ${alias}} from "${path}"; ${alias};`;
      })
      .join("");
    require("fs").writeFileSync(importsFilePath, imports);

    return (
      src(importsFilePath)
        .pipe(webpackStream(webpackConfig(production), webpack))
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
