const execa = require('execa');
const path = require('path');
const {
  hasLocalBranch,
  hasRemoteBranch
} = require("./utils");
const {series} = require('gulp');
const log = require('fancy-log');
const parser = require('yargs-parser');
const _ = require('lodash');

exports.pushToBranch = (argv = process.argv.slice(2)) => {
  async function deployToBranch() {
    const requiredFields = [
      "dest_branch",
      "dist_path",
      "git_paths_to_include"
    ];
    const parsedParams = getProcessParams(
      argv,
      ...requiredFields
    );
    const {
      dest_branch: destBranch,
      dist_path: distPath,
      git_paths_to_include: gitPathsToInclude
    } = parsedParams;
    const {stdout: sourceBranch} = await execa('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
    let {stdout} = await execa('git', ['status', '--porcelain', '--untracked-files=no']);
    let hasChangedFiles = !!stdout;

    return series(
      validParams(parsedParams, ...requiredFields),
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
    await execa('git', ['checkout', sourceBranch, '--', '.gitignore'], {stdio: 'inherit'});

    if (!!gitPathsToInclude && gitPathsToInclude.length > 0) {
      await execa('git', ['checkout', sourceBranch, '--', ...gitPathsToInclude], {stdio: 'inherit'});
    }

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

const getProcessParams = (argv, ...requiredFields) => {
  return parser(
    argv,
    {
      array: "git_paths_to_include",
      default: {
        "git_paths_to_include": []
      },
      string: requiredFields
    }
  );
}

const validParams = (parsedParams, ...requiredFields) => {
  function validParams(cb) {
    const hasAllRequired = _.every(
      requiredFields
        .map(requiredKey => Object.keys(parsedParams).includes(requiredKey))
    );
    if (!hasAllRequired) {
      log("You're missing the required fields: " + requiredFields.join(", "));

      // Help message
      log("\n[push_to_branch] process move build (transpiled) files to branch and push them\n");

      log("--dest_branch name of branch to which push should be made")
      log("--dist_path path where will be available transpiled files under ~/eosc-portal-common-components/dist/<dist_path>")
      log("--git_paths_to_include git files that should be kept")

      process.exit(1);
    }

    cb();
  }

  return validParams;
}
