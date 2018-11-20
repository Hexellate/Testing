const semver = require("semver");
const fs = require("fs");

module.exports.default = function ({
  channel = "",
  comp = "patch",
  val = 0
} = {}) {
  const raw = fs.readFileSync("./package.json");
  const pkg = JSON.parse(raw);

  // Version parts
  let major = semver.major(pkg.version);
  let minor = semver.minor(pkg.version);
  let patch = semver.patch(pkg.version);
  let prever = semver.prerelease(pkg.version)[1];

  switch (comp) {
    case "major":
      major = val;
      break;

    case "minor":
      minor = val;
      break;

    case "patch":
      patch = val;
      break;

    case "prerelease":
    case "pre":
      prever = val;
      if (Number.isNaN(prever)) prever = 0;
      break;
    case "full":
      major = semver.major(val);
      minor = semver.minor(val);
      patch = semver.patch(val);
      [, prever] = semver.prerelease(val);
      if (Number.isNaN(prever)) prever = 0;
      break;
    default:
      break;
  }

  let newver;
  if (channel === "" || channel === "stable") {
    newver = `${major}.${minor}.${patch}`;
  } else {
    newver = `${major}.${minor}.${patch}-${channel}.${prever}`;
  }
  if (comp === "full") {
    newver = val;
  }
  console.log(`change ${pkg.version} to ${newver}`);
  pkg.version = newver;
  fs.writeFileSync("./package.json", JSON.stringify(pkg, null, 2));
  return 0;
};
