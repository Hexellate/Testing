const fs = require("fs");
const yaml = require("js-yaml");

module.exports.default = function (directory) {
  const files = ["latest-mac", "latest-linux", "latest-linux-ia32", "latest"];
  const newdirs = ["mac", "linux", "linux-ia32", "windows"];
  for (const i in files) {
    console.log(`${directory}/${files[i]}.yml`);
    if (fs.existsSync(`${directory}/${files[i]}.yml`)) {
      const raw = fs.readFileSync(`${directory}/${files[i]}.yml`);
      const pkg = yaml.safeLoad(raw);

      const folder = newdirs[i];
      // if (files[i] === files[3]) {
      //   folder = "latest-windows";
      // }
      pkg.path = `${folder}/${pkg.path}`;
      for (const j in pkg.files) {
        pkg.files[j].url = `${folder}/${pkg.files[j].url}`;
      }
      if (files[i] === files[3]) {
        for (const j in pkg.packages) {
          pkg.packages[j].path = `${folder}/${pkg.packages[j].path}`;
        }
      }
      console.log(pkg);
      fs.writeFileSync(`${directory}/${files[i]}.yml`, yaml.safeDump(pkg));
    }
  }
  return 0;
};
