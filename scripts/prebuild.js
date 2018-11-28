const fs = require("fs");
const version = require("./version");

const files = {};
let raw;

raw = fs.readFileSync("./package.json");
files.pkg = JSON.parse(raw);

const channels = ["canary", "next", "stable", "dev"];
for (const i in channels) {
  raw = fs.readFileSync(`./config/${channels[i]}.json`);
  files[channels[i]] = JSON.parse(raw);
}
/**
 * @param  {string} pretag - The previous tag in the repo
 * @param  {string} projectName - The project repo's name
 * @param  {string} projectOwner - The project repo's owner
 * @param  {string} [channel=stable] - The channel to be built
 * @param  {string} sourceMessage - The message of the commit being built
 * @param  {boolean} [forcepatch=false] - Whether to force a patch version for stable
 * @param  {integer} [buildID=270] - The identifier of the build on the CI server
 */
export default function ({
  pretag = "v0.5.0",
  projectName = "projectName",
  projectOwner = "projectOwner",
  channel = "canary",
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
  console.log(`Switching channel to ${channel}`);
  version.set({
    "channel": channel
  });

  // Set transient version
  const mergePattern = /^(Merge pull request #[0-9]{1,4} from .*\/hotfix\/.*)|(Merge branch 'hotfix\/.*')$/g;
  switch (channel) {
    case "next":
    case "canary":
    case "dev":
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
  const tag = `v${version.get("full")}`; // Set tag at runtime based on version
  for (const i in channels) {
    files[
      channels[i]
    ].publish.url = `https://github.com/${projectOwner}/${projectName}/releases/download/${tag}`;
  }

  // Set artifact names
  for (const i in channels) {
    let template;
    // Windows
    template = `${files.pkg.productName} Setup \${version}.\${ext}`;
    files[channels[i]].nsis.artifactName = template
      .replace(" ", "-")
      .replace("---", "-");

    template = `${files.pkg.productName} Web Setup \${version}.\${ext}`;
    files[channels[i]].nsisWeb.artifactName = template
      .replace(" ", "-")
      .replace("---", "-");

    // Mac
    template = `${files.pkg.productName} \${version}.\${ext}`;
    files[channels[i]].dmg.artifactName = template
      .replace(" ", "-")
      .replace("---", "-");

    // Linux
    template = `${files.pkg.productName} \${version}.\${ext}`;
    files[channels[i]].appImage.artifactName = template
      .replace(" ", "-")
      .replace("---", "-");
  }

  // Set productName
  raw = fs.readFileSync("./package.json");
  files.pkg = JSON.parse(raw);
  if (channel !== "stable") {
    files.pkg.productName += ` - ${channel}`;
  }

  fs.writeFileSync("./package.json", JSON.stringify(files.pkg, null, 2));

  for (const i in channels) {
    fs.writeFileSync(
      `./config/${channels[i]}.json`,
      JSON.stringify(files[channels[i]], null, 2)
    );
  }
  return 0;
}
