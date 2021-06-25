const execa = require('execa');
const path = require('path');
const {
  hasLocalBranch,
  hasRemoteBranch
} = require("./utils");
const {series} = require('gulp');
const log = require('fancy-log');

exports.pushToBranch = (destBranch, distPath, gitPathsToInclude = []) => {
  async function deployToBranch() {
    const {stdout: sourceBranch} = await execa('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
    let {stdout} = await execa('git', ['status', '--porcelain', '--untracked-files=no']);
    let hasChangedFiles = !!stdout;

    return series(
      commitLocalChanges(hasChangedFiles),
      createInitialCommit(destBranch, sourceBranch),
      pushDistBranch(destBranch, sourceBranch, distPath, gitPathsToInclude),
      reverseDeploymentChanges(hasChangedFiles, sourceBranch)
    )();
  }

  return deployToBranch;
}

/**
 *
 * @param {boolean} hasChangedFiles
 * @return {(function(*): Promise<void>)|*}
 */
function commitLocalChanges(hasChangedFiles) {
  async function commitLocalChanges(cb) {
    log("commit local changes levl")
    if (!hasChangedFiles) {
      cb();
      return;
    }

    await execa('git', ['add', '-A'], {stdio: 'inherit'});
    const commitMsg = `"!!! Created only for build purposes !!! To reverse changes use command 'git reset --soft HEAD~1'"`;
    await execa('git', ['commit', '-m', commitMsg], {stdio: 'inherit'});
    cb();
  }

  return commitLocalChanges;
}

const pushDistBranch = (destBranch, sourceBranch, distPath, gitPathsToInclude = [], rootPath = path.resolve(__dirname, "../")) => {
  async function pushDistBranch(cb) {
    await execa('git', ['checkout', destBranch], {stdio: 'inherit'});
    await execa('git', ['reset', '--hard', sourceBranch], {stdio: 'inherit'});
    await execa('git', ['rm', '-fr', '.'], {stdio: 'inherit'});
    await execa('git', ['checkout', sourceBranch, '--', ...gitPathsToInclude], {stdio: 'inherit'});

    await execa(
      'find',
      ['./', `-maxdepth`, '1', `-mindepth`, `1`, `-exec`, 'cp', '-t', '../../', '{}', '+'],
      {cwd: path.resolve(rootPath, `dist/${distPath}`)}
    );

    await execa('git', ['add', '-A'], {stdio: 'inherit'});
    await execa('git', ['commit', '-m', `"[${destBranch}] x.y.z"`], {stdio: 'inherit'});
    await execa('git', ['push', 'origin', '--force'], {stdio: 'inherit'});

    cb();
  }

  return pushDistBranch;
}

const createInitialCommit = (destBranch, sourceBranch) => {
  async function createInitialCommit(cb) {
    await execa('git', ['fetch']);
    let hasLocalDeployBranch = hasLocalBranch(destBranch);
    let hasRemoteDeployBranch = hasRemoteBranch(destBranch);

    if (hasLocalDeployBranch && !hasRemoteDeployBranch) {
      await execa('git', ['branch', '-D', destBranch]);
      hasLocalDeployBranch = false;
    }

    if (!hasLocalDeployBranch) {
      await execa('git', ['checkout', '-b', destBranch], {stdio: 'inherit'});
      await execa('touch', ['temp.txt'], {stdio: 'inherit'});
      await execa('git', ['add', '-A'], {stdio: 'inherit'});
      await execa('git', ['commit', '-m', '[Initial commit]'], {stdio: 'inherit'});
      await execa('git', ['push', '--set-upstream', 'origin', destBranch], {stdio: 'inherit'});
      await execa('git', ['checkout', sourceBranch], {stdio: 'inherit'});
    }

    cb();
  }

  return createInitialCommit;
}

/**
 *
 * @param {boolean} hasChangedFiles
 * @param sourceBranch
 * @return {Promise<void>}
 */
const reverseDeploymentChanges = (hasChangedFiles, sourceBranch) => {
  async function reverseDeploymentChanges(cb) {
    await execa('git', ['checkout', sourceBranch], {stdio: 'inherit'});

    if (!hasChangedFiles) {
      cb();
      return;
    }

    await execa('git', ['reset', '--soft', 'HEAD~1'], {stdio: 'inherit'});
    cb();
  }

  return reverseDeploymentChanges;
}
