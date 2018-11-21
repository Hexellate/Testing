const semver = require("semver");
const fs = require("fs");

module.exports.default = function ({ channel = "", bump = "patch" } = {}) {
  const raw = fs.readFileSync("./package.json");
  const pkg = JSON.parse(raw);

  // Version parts
  let major = semver.major(pkg.version);
  let minor = semver.minor(pkg.version);
  let patch = semver.patch(pkg.version);
  // let channel = "stable";
  let prever = 0;
  if (semver.prerelease(pkg.version) != null) {
    [, prever] = semver.prerelease(pkg.version);
  }

  switch (bump) {
    case "major":
      major++;
      minor = 0;
      patch = 0;
      prever = 0;
      break;

    case "minor":
      minor++;
      patch = 0;
      prever = 0;
      break;

    case "patch":
      patch++;
      prever = 0;
      break;

    case "prerelease":
    case "pre":
      prever++;
      if (Number.isNaN(prever)) prever = 0;
      break;

    default:
      break;
  }

  let newver;
  if (channel === "" || channel === "stable") {
    newver = `${major}.${minor}.${patch}`;
    // } else if (channel === "stable") {
    //   newver = `${major}.${minor}.${patch}-${channel}`;
  } else {
    newver = `${major}.${minor}.${patch}-${channel}.${prever}`;
  }
  console.log(`Bump ${pkg.version} to ${newver}`);
  pkg.version = newver;
  fs.writeFileSync("./package.json", JSON.stringify(pkg, null, 2));
  return 0;
};
