const fs = require("fs");

module.exports.default = function (packName) {
  const raw = fs.readFileSync("./package.json");
  const pkg = JSON.parse(raw);
  let ver;
  if (packName in pkg.devDependencies) {
    ver = pkg.devDependencies[packName];
  } else if (packName in pkg.dependencies) {
    ver = pkg.dependencies[packName];
  }
  return ver;
};
