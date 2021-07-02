const {watch, series} = require("gulp");
const del = require('del');
const path = require('path');
const {buildLib} = require("./lib-build.helper");
const parser = require("yargs-parser");
const {preprocessStyles} = require("./lib-build.helper");
const {buildDocumentation} = require("./doc-build.helper");
const browserSync = require('browser-sync').create();

const rootPath = path.resolve(__dirname, "../");
const distPath = 'serve';
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
  const env = parser(process.argv.slice(2))["env"];
  const argv = [
    ...process.argv.splice(0, 3),
    '--mode', 'development',
    '--dist_path', distPath,
    '--env', !!env ? env : ""
  ];

  // on styles changes
  const stylesPathsPatterns = [
    path.resolve(rootPath, 'styles/**/*.scss'),
    path.resolve(rootPath, 'styles/**/*.css')
  ];
  watch(stylesPathsPatterns, options, preprocessStyles(distPath, browserSync));

  // on ts files changes
  const libFilesToBuild = [
    path.resolve(rootPath, `src/**/*.ts`),
    path.resolve(rootPath, 'src/**/*.tsx'),
    path.resolve(rootPath, 'src/**/*.js'),
    path.resolve(rootPath, 'src/**/*.json'),
  ];
  watch(libFilesToBuild, options, buildLib(argv));
  watch(path.resolve(rootPath, `dist/${distPath}/index.min.js`), options)
    .on('change', browserSync.reload);

  // on documentation changes
  const docFilesToBuild = [
    path.resolve(rootPath, 'documentation/**/*.tsx'),
    path.resolve(rootPath, 'documentation/**/*.ts'),
    path.resolve(rootPath, 'documentation/**/*.json')
  ];
  watch(docFilesToBuild, options, buildDocumentation());
  watch(path.resolve(rootPath, 'dist/documentation/index.min.js'))
    .on('change', browserSync.reload);

  const filesToWatch = [
    path.resolve(rootPath, 'documentation/**/*.css'),
    path.resolve(rootPath, 'documentation/**/*.html')
  ];
  watch(filesToWatch)
    .on('change', browserSync.reload);
}

