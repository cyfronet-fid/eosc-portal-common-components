const path = require('path');
const {validParams} = require("./utils");
const {buildLib} = require("./lib-build.helper");
const {transpileToBundle} = require("./utils");
const {dest, parallel, src, series} = require('gulp');
const parser = require('yargs-parser');

const rootPath = path.resolve(__dirname, "../")
exports.buildDocumentation = (argv = process.argv.slice(2)) => {
  const parsedParams = parser(argv);
  const {mode, env} = parsedParams;
  return series(
    validParams(parsedParams, "mode", "env"),
    parallel(
      buildLib([
        this.name,
        "--mode", mode,
        "--env", env
      ]),
      transpileToBundle(
        path.resolve(rootPath, 'documentation/*.tsx'),
        mode,
        env,
        'documentation'
      ),
      function moveCssFiles() {
        return src(path.resolve(rootPath, "documentation/*.css"))
          .pipe(dest(path.resolve(rootPath, `dist`)))
      },
      function moveHtmlFiles() {
        return src(path.resolve(rootPath, "documentation/index.html"))
          .pipe(dest(path.resolve(rootPath, `dist`)))
      }
    )
  );
}