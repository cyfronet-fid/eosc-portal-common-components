const {watch, series} = require("gulp");
const browserSync = require('browser-sync').create();
const del = require('del');
const path = require('path');
const {buildLib} = require("./lib-build.helper");
const parser = require("yargs-parser");

exports.serve = (cb) => {
  const rootPath = path.resolve(__dirname, "../");

  del(path.resolve(rootPath, "./dist"));
  const distPath = 'serve';
  const parsedArgv = parser(process.argv.slice(2));
  const argv = [
    ...process.argv.splice(0, 3),
    '--mode', 'development',
    '--dist_path', distPath,
    '--env', parsedArgv["env"]
  ];

  const filesToBuild = [
    path.resolve(rootPath, 'src/**/*.ts'),
    path.resolve(rootPath, 'src/**/*.tsx'),
    path.resolve(rootPath, 'src/**/*.js'),
    path.resolve(rootPath, 'src/**/*.json'),

    path.resolve(rootPath, 'styles/**/*.scss'),
    path.resolve(rootPath, 'styles/**/*.css')
  ];
  const options = {
    delay: 500,
    ignoreInitial: false
  }

  browserSync.init({
    server: rootPath,
    startPath: path.resolve(rootPath, "/documentation/index.html")
  });

  watch(filesToBuild, options, series(
    buildLib(argv),
    browserSync.reload
  ));

  const filesToWatch = [
    path.resolve(rootPath, 'documentation/**/*.css'),
    path.resolve(rootPath, 'documentation/**/*.html')
  ];
  watch(filesToWatch)
    .on('change', browserSync.reload);

  cb();
}