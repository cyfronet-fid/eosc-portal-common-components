const {buildDocumentation} = require("./deployment/doc-build.helper");
const {pushToBranch} = require("./deployment/git.helper");
const {buildLib} = require("./deployment/lib-build.helper");
const {series} = require('gulp');
const parser = require('yargs-parser');
const _ = require("lodash");
const log = require("fancy-log");

let BUILD_PARAMS;
const BUILD_REQUIRED_FIELDS = ["mode", "dist_path"];
const ALLOWED_MODES = ["production", "development"];
exports.build_lib = series(
  () => {
    const parsedParams = parser(process.argv.slice(2));
    const hasAllRequired = _.every(
      BUILD_REQUIRED_FIELDS
        .map(requiredKey => Object.keys(parsedParams).includes(requiredKey))
    );
    if (!hasAllRequired || !ALLOWED_MODES.includes(parsedParams["mode"])) {
      log("You're missing the required fields: " + BUILD_REQUIRED_FIELDS.join(", "));
      log("or mode has other value than development or production")

      // Help message
      log("\n[build_lib] process produce transpiled files to `dist_path` depend on `mode`\n");

      log("--dist_path path where will be available transpiled files under ~/eosc-portal-common-components/dist/<dist_path>")
      log("--mode enum with allowed values 'production'|'development' which will produce different output")

      process.exit(1);
      return;
    }

    BUILD_PARAMS = parsedParams;

    return buildLib(
      BUILD_PARAMS["mode"],
      BUILD_PARAMS["dist_path"]
    )();
  }
)

let PUSH_TO_BRANCH_PARAMS;
const PUSH_TO_BRANCH_REQUIRED_FIELDS = ["dest_branch", "dist_path", "git_paths_to_include"];
exports.push_to_branch = series(
  () => {
    const parsedParams = parser(
      process.argv.slice(2),
      {
        array: "git_paths_to_include",
        default: {
          "git_paths_to_include": []
        },
        string: PUSH_TO_BRANCH_REQUIRED_FIELDS
      }
    );
    log(parsedParams);
    const hasAllRequired = _.every(
      PUSH_TO_BRANCH_REQUIRED_FIELDS
        .map(requiredKey => Object.keys(parsedParams).includes(requiredKey))
    );
    if (!hasAllRequired) {
      log("You're missing the required fields: " + PUSH_TO_BRANCH_REQUIRED_FIELDS.join(", "));

      // Help message
      log("\n[push_to_branch] process move build (transpiled) files to branch and push them\n");

      log("--dest_branch name of branch to which push should be made")
      log("--dist_path path where will be available transpiled files under ~/eosc-portal-common-components/dist/<dist_path>")
      log("--git_paths_to_include git files that should be kept")

      process.exit(1);
      return;
    }

    PUSH_TO_BRANCH_PARAMS = parsedParams;

    return pushToBranch(
      PUSH_TO_BRANCH_PARAMS["dest_branch"],
      PUSH_TO_BRANCH_PARAMS["dist_path"],
      PUSH_TO_BRANCH_PARAMS["git_paths_to_include"]
    )();
  }
);
exports.deploy_documentation = series(
  (cb) => cb()
  // buildDocumentation(), // Always production
  // deployToBranch('documentation', 'documentation', ['.gitignore', 'README.md'])
)