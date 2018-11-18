const semver = require("semver");
const fs = require("fs");

module.exports.default = function (comp) {
  const raw = fs.readFileSync("./package.json");
  const pkg = JSON.parse(raw);

  // Version parts
  const major = semver.major(pkg.version);
  const minor = semver.minor(pkg.version);
  const patch = semver.patch(pkg.version);
  const channel = semver.prerelease(pkg.version)[0];
  const prever = semver.prerelease(pkg.version)[1];

  let ver;
  switch (comp) {
    case "full":
      ver = pkg.version;
      break;
    case "major":
      ver = major;
      break;
    case "minor":
      ver = minor;
      break;
    case "patch":
      ver = patch;
      break;
    case "channel":
      ver = channel;
      break;
    case "pre":
    case "prerelease":
      ver = prever;
      break;
    default:
      ver = `${major}.${minor}.${patch}`;
      break;
  }

  return ver;
};
