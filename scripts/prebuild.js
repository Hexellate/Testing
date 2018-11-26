/*
  prebuild:
  Duplicate package.json to package.json.old
  switch channel info
  set transient version
  set autoupdate config
  Set package.productName to pkgbase.productname+channel

  postbuild:
  set package.json contents to package.json.old
  delete package.json.old

 */

// append -${branch} to pkg.json
// Set nsisweb update url
const fs = require("fs");
const version = require("version");
// const minimist = require("minimist");
// const yaml = require("js-yaml");

const files = {};
let raw;

raw = fs.readFileSync("./package.json");
files.pkg = JSON.parse(raw);

const channels = ["canary", "next", "stable", "dev"]; // TODO: Properly implement "dev" channel
for (const i in channels) {
  raw = fs.readFileSync(`./config/${channels[i]}.json`);
  files[channels[i]] = JSON.parse(raw);
}
/**
 * @param  {string} [tag] - The tag to use for the release
 * @param  {string} pretag - The previous tag in the repo
 * @param  {string} projectName - The project repo's name
 * @param  {string} projectOwner - The project repo's owner
 * @param  {string} [channel=stable] - The channel to be built
 * @param  {string} sourceMessage - The message of the commit being built
 * @param  {boolean} [forcepatch=false] - Whether to force a patch version for stable
 * @param  {integer} [buildID=270] - The identifier of the build on the CI server
 */
export default function ({
  tag = "v0.5.1",
  pretag = "v0.5.0",
  projectName = "projectName",
  projectOwner = "projectOwner",
  channel = "stable",
  sourceMessage = "none",
  forcepatch = false,
  buildID = 270
} = {}) {
  // Create backup of package.json and channel configs
  fs.writeFileSync("./package.json.bak", JSON.stringify(files.pkg, null, 2));
  for (const i in channels) {
    fs.writeFileSync(
      `./config/${channels[i]}.json.bak`,
      JSON.stringify(files[channels[i]], null, 2)
    );
  }

  // Switch channel info

  if (channel === "none") {
    console.log("ERROR: Channel info not set");
    return 0;
  }
  version.set({
    "channel": channel
  });
  console.log(`Channel switched to ${channel}`);

  // Set transient version
  const mergePattern = /^(Merge pull request #[0-9]{1,4} from .*\/hotfix\/.*)|(Merge branch 'hotfix\/.*')$/g;
  switch (channel) {
    case "next":
    case "canary":
      version.set({
        "pre": buildID
      });
      break;
    case "stable":
    default:
      if (mergePattern.test(sourceMessage) || forcepatch) {
        version.set({
          "full": pretag
        });
        version.bump();
      }
      break;
  }

  // Set Autoupdate config

  for (const i in channels) {
    files[
      channels[i]
    ].publish.url = `https://github.com/${projectOwner}/${projectName}/releases/download/${tag}`; // TODO: Use generated tag if not provided
  }

  // Set productName
  if (channel !== "stable") {
    files.pkg.productName += ` - ${channel}`;
  }

  // if (channel !== "stable") files.pkg.name += `-${channel}`;
  // This is because even though appId is changed per channel, electron still seems to use a folder based on the project name.

  console.log(JSON.stringify(files, null, 2));
  fs.writeFileSync("./package.json", JSON.stringify(files.pkg, null, 2));
  fs.writeFileSync("./config/next.json", JSON.stringify(files.next, null, 2));
  fs.writeFileSync(
    "./config/canary.json",
    JSON.stringify(files.canary, null, 2)
  );
  fs.writeFileSync(
    "./config/stable.json",
    JSON.stringify(files.stable, null, 2)
  );
  return 0;
}
