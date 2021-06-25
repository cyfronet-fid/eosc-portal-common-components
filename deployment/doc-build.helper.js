const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const {getTsWebpackConfig} = require("./utils");
const path = require('path');
const {dest, parallel, src} = require('gulp');

/**
 *
 * @return {*}
 */
exports.buildDocumentation = (rootPath = path.resolve(__dirname, "../")) => {
  return parallel(
    transpileDocumentationComponentsBundle(),
    () => src(path.resolve(rootPath, "documentation/*.css"))
      .pipe(dest(path.resolve(rootPath, 'dist/documentation/'))),
    () => src(path.resolve(rootPath, "documentation/index.html"))
      .pipe(dest(path.resolve(rootPath, 'dist/documentation/')))
  );
}

const transpileDocumentationComponentsBundle = (rootPath = path.resolve(__dirname, "../")) => {
  function transpileComponentsBundle() {
    return webpackStream(
      getTsWebpackConfig(
        "production",
        {"index": path.resolve(rootPath, "documentation/index.tsx")}
      ),
      webpack
    ).pipe(dest(path.resolve(rootPath, 'dist/documentation/')));
  }

  return transpileComponentsBundle;
}