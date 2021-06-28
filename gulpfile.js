const {serve} = require("./deployment/serve.helper");
const {buildDocumentation} = require("./deployment/doc-build.helper");
const {pushToBranch} = require("./deployment/git.helper");
const {buildLib} = require("./deployment/lib-build.helper");
const {task} = require("gulp");

task('build_lib', buildLib());
task('push_to_branch', pushToBranch());
task('serve', serve);

// exports.deploy_documentation = series(
//   (cb) => cb()
//   // buildDocumentation(), // Always production
//   // deployToBranch('documentation', 'documentation', ['.gitignore', 'README.md'])
// )