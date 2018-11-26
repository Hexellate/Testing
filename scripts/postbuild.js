const fs = require("fs");
// const yaml = require("js-yaml");

export default function () {
  const files = {};
  let raw;

  raw = fs.readFileSync("./package.json.old");
  files.pkg = JSON.parse(raw);

  const channels = ["canary", "next", "stable"];
  for (const i in channels) {
    raw = fs.readFileSync(`./config/${channels[i]}.json.old`);
    files[channels[i]] = JSON.parse(raw);
  }

  // Restore package.json and channel configs from backup
  fs.writeFileSync("./package.json", JSON.stringify(files.pkg, null, 2));
  for (const i in channels) {
    fs.writeFileSync(
      `./config/${channels[i]}.json`,
      JSON.stringify(files[channels[i]], null, 2)
    );
  }
  return 0;
}
