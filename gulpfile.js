const { task, series } = require("gulp");
const execa = require("execa");
const { updateS3BucketPolicy } = require("./deployment/update-s3-policies");
const { serve } = require("./deployment/serve.helper");
const { buildLib } = require("./deployment/lib-build.helper");

task("build_lib", buildLib());
task("serve", serve);
task(
  "remove_dist",
  series(async function removeOldDist(cb) {
    await execa("rm", ["-fR", "dist"], { stdio: "inherit" });
    cb();
  })
);
task("update-s3-policies", updateS3BucketPolicy());
