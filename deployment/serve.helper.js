const { watch, series } = require("gulp");
const del = require("del");
const path = require("path");
const { preprocessStyles } = require("./lib-build.helper");
const browserSync = require("browser-sync").create();
const execa = require("execa");
const compression = require("compression");
const { src, dest } = require("gulp");
const rename = require("gulp-rename");

const rootPath = path.resolve(__dirname, "../");
exports.serve = series(
  (cb) => del(path.resolve(rootPath, "dist"), cb),
  function moveAssets() {
    return src(path.resolve(rootPath, "styles/assets/*")).pipe(dest(path.resolve(rootPath, "dist/assets")));
  },
  function moveEnv() {
    return src(path.resolve(rootPath, "env/env.development.js"))
      .pipe(rename("env.js"))
      .pipe(dest(path.resolve(rootPath, "env")));
  },
  preprocessStyles(false, "env/env.development.js", browserSync),
  async (cb) => {
    await execa("npm", ["run", "build:docs"]);
    cb();
  },
  () => {
    browserSync.init({
      server: rootPath,
      startPath: path.resolve(rootPath, "/dist/docs/index.html"),
      middleware: [compression()],
    });

    // on lib SCSS changes
    const stylesPathsPatterns = [path.resolve(rootPath, "styles/**/*.scss"), path.resolve(rootPath, "styles/**/*.css")];
    watch(
      stylesPathsPatterns,
      {
        delay: 500,
        ignoreInitial: true,
      },
      preprocessStyles(false, "env/env.development.js", browserSync)
    );

    // on lib JS/JSX changes
    const libFilesToBuild = [
      path.resolve(rootPath, "src/**/*.jsx"),
      path.resolve(rootPath, "src/**/*.js"),
      path.resolve(rootPath, "core/**/*.jsx"),
      path.resolve(rootPath, "core/**/*.js"),
      path.resolve(rootPath, "configurations/**/*.json"),
    ];
    watch(
      libFilesToBuild,
      {
        delay: 500,
        ignoreInitial: false,
      },
      series(
        async (cb) => {
          await execa("npm", ["run", "build:docs"]);
          cb();
        },
        (cb) => {
          browserSync.reload();
          cb();
        }
      )
    );
  }
);
