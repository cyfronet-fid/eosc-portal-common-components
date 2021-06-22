const {src, dest, parallel, series} = require('gulp');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const path = require('path');
const execa = require('execa');
const log = require('fancy-log');
const {COMPONENTS_PATHS, STYLES_PATHS} = require("./index");
const concat = require('gulp-concat');
const del = require('del');
const {
  replaceEnvConfig,
  getTsWebpackConfig,
  getFileNameFrom,
  getScssWebpackConfig,
  restoreEnvFiles
} = require("./deployment/utils");

/**
 *
 * @param {string} distPath
 * @param {"development"|"production"} mode
 * @return {*}
 */
const buildLib = (distPath, mode = "development") => {
  return series(
    (cb) => replaceEnvConfig(cb, mode),
    // remove old build
    async (cb) => {
      await execa('rm', ['-fR', `./dist/${distPath}`], {stdio: 'inherit'});
      cb();
    },
    parallel(
      // transpile components to separate files
      () => webpackStream(
        getTsWebpackConfig(
          mode,
          Object.assign({}, ...COMPONENTS_PATHS
            .map(componentPath => path.resolve(__dirname, componentPath))
            .map(componentPath => ({[getFileNameFrom(componentPath)]: componentPath})))
        ),
        webpack
      )
        .pipe(dest(`dist/${distPath}/`)),
      // TRanspile scss to separate files
      () => webpackStream(
        getScssWebpackConfig(
          mode,
          Object.assign({}, ...STYLES_PATHS
            .map(stylesPath => path.resolve(__dirname, stylesPath))
            .map(stylesPath => ({[getFileNameFrom(stylesPath)]: stylesPath})))
        ),
        webpack
      )
        .pipe(dest(`dist/${distPath}/`)),
      // Transpile ts to single file
      () => src(COMPONENTS_PATHS.map(componentPath => path.resolve(__dirname, componentPath)))
        .pipe(concat('bundle.tsx'))
        .pipe(dest(`dist/${distPath}/`))
        .pipe(
          webpackStream(
            getTsWebpackConfig(
              mode,
              {"index": path.resolve(__dirname, `dist/${distPath}/bundle.tsx`)}
            ),
            webpack
          )
        )
        .pipe(dest(`dist/${distPath}/`))
        .on('end', () => del(path.resolve(__dirname, `dist/${distPath}/bundle.tsx`))),
      // Transpile Scss to single file
      () => webpackStream(
        getScssWebpackConfig(
          mode,
          {"index": path.resolve(__dirname, 'styles/index.scss')}
        ),
        webpack
      )
        .pipe(dest(`dist/${distPath}/`))
    ),
    // remove rand files from webpack
    (cb) => del([`dist/${distPath}/*.js`, `!dist/${distPath}/*.min.js`], cb),
    (cb) => restoreEnvFiles(cb, mode)
  );
}

const buildDocumentation = () => {
  return parallel(
    () => webpackStream(
      getTsWebpackConfig(
        "production",
        {"index": path.resolve(__dirname, "documentation/index.tsx")}
      ),
      webpack
    ).pipe(dest('dist/documentation/')),
    () => src("documentation/*.css").pipe(dest('dist/documentation/')),
    () => src("documentation/index.html").pipe(dest('dist/documentation/'))
  );
}

const commitLocalChanges = async () => {
  await execa(
    'git',
    ['add', '-A'],
    {stdio: 'inherit'}
  );
  const commitMsg = `"!!! Created only for build purposes !!! To reverse changes use command 'git reset --soft HEAD~1'"`;
  await execa(
    'git',
    ['commit', '-m', commitMsg],
    {stdio: 'inherit'}
  );
}

const pushDistBranch = async (branch, sourceBranchName, distPath, gitPathsToInclude = []) => {
  await execa('git', ['checkout', branch], {stdio: 'inherit'});
  await execa('git', ['reset', '--hard', sourceBranchName], {stdio: 'inherit'});
  await execa('git', ['rm', '-fr', '.'], {stdio: 'inherit'});
  await execa('git', ['checkout', sourceBranchName, '--', ...gitPathsToInclude], {stdio: 'inherit'});

  const {stdout: rootPath} = await execa('pwd');
  await execa(
    'find',
    ['./', `-maxdepth`, '1', `-mindepth`, `1`, `-exec`, 'cp', '-t', '../../', '{}', '+'],
    {cwd: `${rootPath}/dist/${distPath}`}
  );


  await execa('git', ['add', '-A'], {stdio: 'inherit'});
  // TODO: update git tag version
  // TODO: update commit with tag version
  await execa('git', ['commit', '-m', `"[${branch}] x.y.z"`], {stdio: 'inherit'});
  await execa('git', ['push', 'origin', '--force'], {stdio: 'inherit'});
}

const reverseLocalChangesCommit = async (sourceBranchName) => {
  await execa('git', ['checkout', sourceBranchName], {stdio: 'inherit'});
  await execa('git', ['reset', '--soft', 'HEAD~1'], {stdio: 'inherit'});
}

const deployLib = async (deployBranch, distPath, gitPathsToInclude = []) => {
  // prepare to deploy
  const {stdout: currentBranchName} = await execa(
    'git',
    ['rev-parse', '--abbrev-ref', 'HEAD']
  );
  let {stdout: hasChangedFiles} = await execa(
    'git',
    ['status', '--porcelain', '--untracked-files=no']
  );
  hasChangedFiles = !!hasChangedFiles;
  if (hasChangedFiles) {
    await commitLocalChanges();
  }

  // initialize deploy branch if not exists
  await execa('git', ['fetch']);

  let hasLocallyDeployBranch;
  try {
    let {stdout} = await execa('git', ['show-ref', `refs/heads/${deployBranch}`]);
    hasLocallyDeployBranch = !!stdout;
  } catch (error) {
    hasLocallyDeployBranch = false;
  }

  let hasRemoteDeployBranch;
  try {
    let {stdout} = await execa('git', ['ls-remote', '--exit-code', '--heads', 'origin', deployBranch]);
    hasRemoteDeployBranch = !!stdout;
  } catch (error) {
    hasRemoteDeployBranch = false;
  }

  if (hasLocallyDeployBranch && !hasRemoteDeployBranch) {
    await execa('git', ['branch', '-D', deployBranch]);
    hasLocallyDeployBranch = false;
  }

  log(hasLocallyDeployBranch, hasRemoteDeployBranch);
  if (!hasLocallyDeployBranch) {
    await execa('git', ['checkout', '-b', deployBranch]);

    // push initial commit
    await execa('touch', ['temp.txt'], {stdio: 'inherit'});
    await execa('git', ['add', '-A'], {stdio: 'inherit'});
    await execa('git', ['commit', '-m', '[Initial commit]']);
    await execa('git', ['push', '--set-upstream', 'origin', deployBranch]); //git push --set-upstream origin stable
    await execa('git', ['checkout', currentBranchName]);
  }

  // deploy
  await pushDistBranch(deployBranch, currentBranchName, distPath, gitPathsToInclude)
  if (hasChangedFiles) {
    await reverseLocalChangesCommit(currentBranchName);
  }
}

exports.deploy_stable_lib = series(
  buildLib('stable', "production"),
  async (cb) => {
    await deployLib('stable', 'stable', ['.gitignore', 'README.md']);
    cb();
  }
)
exports.deploy_latest_lib = series(
  buildLib('latest', "development"),
  async (cb) => {
    await deployLib('latest', 'latest', ['.gitignore', 'README.md']);
    cb();
  }
)
exports.deploy_lib_version = {}