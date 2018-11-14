const semver = require("semver");
const fs = require("fs");

module.exports.default = function (full) {
  const raw = fs.readFileSync("./package.json");
  const pkg = JSON.parse(raw);

  // Version parts
  const major = semver.major(pkg.version);
  const minor = semver.minor(pkg.version);
  const patch = semver.patch(pkg.version);

  let ver;
  if (full) {
    ver = pkg.version;
  } else {
    ver = `${major}.${minor}.${patch}`;
  }
  return ver;
};
