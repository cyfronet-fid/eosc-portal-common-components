const {
 src, dest, series, parallel 
} = require("gulp");
const path = require("path");
const parser = require("yargs-parser");
const gulpIf = require("gulp-if");
const sass = require("gulp-sass")(require("sass"));
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const concat = require("gulp-concat");
const named = require("vinyl-named");
const webpack = require("webpack");
const webpackStream = require("gulp-webpack");
const TerserPlugin = require("terser-webpack-plugin");
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
    function moveAssets() {
      return src(path.resolve(rootPath, "styles/assets/*")).pipe(dest(path.resolve(rootPath, "dist/assets")));
    },
    parallel(
      series(replaceEnvConfig(env), transpileFiles(bundleEntries, production, env))
      // preprocessStyles(production, env)
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
  const webpackConf = {
    mode: production ? "production" : "development",
    resolve: {
      extensions: [".jsx", ".js", ".json"],
      modules: ["node_modules"],
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/i,
          exclude: /node_modules|\.git/,
          use: {
            loader: "babel-loader",
          },
        },
      ],
    },
    optimization: {
      minimize: production,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ecma: "5",
            topLevel: true,
            compress: true,
          },
        }),
      ],
    },
  };
  function transpileFiles() {
    return (
      src(paths)
        .pipe(
          named(
            (file) =>
              `${file.path
              .replace(/^.*[\\/]/, "")
              .replace(/\.[^/.]+$/, "")
              .replace(".component", "")}.${getSuffixBy(env)}.min`
          )
        )
        .pipe(gulpIf(!production, sourcemaps.init()))
        .pipe(webpackStream(webpackConf, webpack))
        .pipe(gulpIf(!production, sourcemaps.write(".")))
        .pipe(dest(path.resolve(rootPath, "dist")))

        // concat to bundle
        .pipe(concat(`${bundleName}.${getSuffixBy(env)}.min.js`))
        .pipe(dest(path.resolve(rootPath, "dist")))
    );
  }

  return transpileFiles;
}

function replaceEnvConfig(env) {
  function replaceEnvConfig() {
    return src(path.resolve(rootPath, env))
      .pipe(rename("env.js"))
      .pipe(dest(path.resolve(rootPath, "env")));
  }

  return replaceEnvConfig;
}
