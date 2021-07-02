const {watch, series} = require("gulp");
const del = require('del');
const path = require('path');
const {buildLib} = require("./lib-build.helper");
const parser = require("yargs-parser");
const {COMPONENTS_PATHS} = require("../index");
const {transpileToBundle} = require("./lib-build.helper");
const {preprocessStyles} = require("./lib-build.helper");
const {buildDocumentation} = require("./doc-build.helper");
const browserSync = require('browser-sync').create();

const rootPath = path.resolve(__dirname, "../");
const options = {
  delay: 500,
  ignoreInitial: false
}
exports.serve = () => {
  del(path.resolve(rootPath, "./dist"));
  browserSync.init({
    server: rootPath,
    startPath: path.resolve(rootPath, "/documentation/index.html")
  });

  // on lib styles changes
  const stylesPathsPatterns = [
    path.resolve(rootPath, 'styles/**/*.scss'),
    path.resolve(rootPath, 'styles/**/*.css')
  ];
  watch(stylesPathsPatterns, options, preprocessStyles('serve', browserSync));

  // on lib ts changes
  const libFilesToBuild = [
    path.resolve(rootPath, `src/**/*.ts`),
    path.resolve(rootPath, 'src/**/*.tsx'),
    path.resolve(rootPath, 'src/**/*.js'),
    path.resolve(rootPath, 'src/**/*.json'),
  ];
  watch(
    libFilesToBuild,
    options,
    series(
      transpileToBundle(
        COMPONENTS_PATHS.map(componentPath => path.resolve(rootPath, componentPath)),
        'development',
        'serve'
      ),
      (cb) => { browserSync.reload(); cb();}
    )
  );

  // on documentation changes
  const docFilesToBuild = [
    path.resolve(rootPath, 'documentation/index.tsx'),
    path.resolve(rootPath, 'documentation/index.json')
  ];
  watch(
    docFilesToBuild,
    options,
    series(buildDocumentation(), (cb) => { browserSync.reload(); cb();})
  );

  const filesToWatch = [
    path.resolve(rootPath, 'documentation/**/*.css'),
    path.resolve(rootPath, 'documentation/**/*.html')
  ];
  watch(filesToWatch)
    .on('change', browserSync.reload);
}

