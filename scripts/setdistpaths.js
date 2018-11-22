const fs = require("fs");
const yaml = require("js-yaml");

module.exports.default = function ({ directory, author, projectname } = {}) {
  const files = ["latest-mac", "latest-linux", "latest-linux-ia32", "latest"];
  const raw = fs.readFileSync(`./package.json`);
  const pkg = JSON.parse(raw);

  const prependURL = `https://github.com/${author}/${projectname}/releases/download/v${
    pkg.version
  }`;

  // update each yml tracking file with github releases url
  for (const i in files) {
    console.log(`${directory}/${files[i]}.yml`);

    // only run if file actually exists
    if (fs.existsSync(`${directory}/${files[i]}.yml`)) {
      const distFileRaw = fs.readFileSync(`${directory}/${files[i]}.yml`);
      const distFile = yaml.safeLoad(distFileRaw);

      // update root path
      distFile.path = `${prependURL}/${distFile.path}`;
      distFile.path = distFile.path.replace(/\s/g, ".");
      // update all files entries
      for (const j in distFile.files) {
        distFile.files[j].url = `${prependURL}/${distFile.files[j].url}`;
        distFile.files[j].url = distFile.files[j].url.replace(/\s/g, ".");
      }

      // update all package entries for windows
      if (files[i] === files[3]) {
        for (const j in distFile.packages) {
          distFile.packages[j].path = `${prependURL}/${
            distFile.packages[j].path
          }`;
          distFile.packages[j].path = distFile.packages[j].path.replace(
            /\s/g,
            "."
          );
        }
      }
      // console.log(distFile);
      fs.writeFileSync(`${directory}/${files[i]}.yml`, yaml.safeDump(distFile));
    }
  }
  return 0;
};
