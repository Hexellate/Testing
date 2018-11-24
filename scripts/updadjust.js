// append -${branch} to pkg.json
// Set nsisweb update url
const fs = require("fs");
// const yaml = require("js-yaml");

module.exports.default = function ({
  tag = "none",
  projectName = "none",
  projectOwner = "none",
  channel = "none"
} = {}) {
  const files = {};
  let raw;
  raw = fs.readFileSync("./package.json");
  files.pkg = JSON.parse(raw);
  raw = fs.readFileSync("./config/canary.json");
  files.canary = JSON.parse(raw);
  raw = fs.readFileSync("./config/next.json");
  files.next = JSON.parse(raw);
  raw = fs.readFileSync("./config/stable.json");
  files.stable = JSON.parse(raw);
  const channels = ["canary", "next", "stable"];

  if (channel !== "stable") files.pkg.name += `-${channel}`;
  // This is because even though appId is changed per channel, electron still seems to use a folder based on the project name.

  for (const i in channels) {
    // files[channels[i]].nsisWeb.appPackageUrl = "https://github.com/Hexellate/autoupdate-test/releases/download/v0.5.0-canary.330/autoupdate-test-0.5.0-canary.330-x64.nsis.7z";
    files[
      channels[i]
    ].nsisWeb.appPackageUrl = `https://github.com/${projectOwner}/${projectName}/releases/download/${tag}`;
    files[
      channels[i]
    ].publish.url = `https://github.com/${projectOwner}/${projectName}/releases/download/${tag}`;
  }
  console.log(JSON.stringify(files, null, 2));
  fs.writeFileSync("./package.json", JSON.stringify(files.pkg, null, 2));
  fs.writeFileSync("./canary.json", JSON.stringify(files.canary, null, 2));
  fs.writeFileSync("./next.json", JSON.stringify(files.next, null, 2));
  fs.writeFileSync("./stable.json", JSON.stringify(files.stable, null, 2));
  return 0;
};
