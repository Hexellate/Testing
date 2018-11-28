const fs = require("fs");

export default function () {
  const files = {};
  let raw;

  raw = fs.readFileSync("./package.json.bak");
  files.pkg = JSON.parse(raw);

  const channels = ["canary", "next", "stable", "dev"];
  for (const i in channels) {
    raw = fs.readFileSync(`./config/${channels[i]}.json.bak`);
    files[channels[i]] = JSON.parse(raw);
  }

  // Restore package.json and channel configs from backup
  fs.writeFileSync("./package.json", JSON.stringify(files.pkg, null, 2));
  fs.unlinkSync("./package.json.bak");
  for (const i in channels) {
    fs.writeFileSync(
      `./config/${channels[i]}.json`,
      JSON.stringify(files[channels[i]], null, 2)
    );
    fs.unlinkSync(`./config/${channels[i]}.json.bak`);
  }
  return 0;
}
