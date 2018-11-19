const fs = require("fs");
// const yaml = require("js-yaml");

module.exports.default = function ({
  dir = "../pipe",
  version = "",
  branch = "none",
  tag = "none",
  channel = "none"
} = {}) {
  // const raw = fs.readFileSync("./package.json");
  // const pkg = JSON.parse(raw);
  fs.writeFileSync(`${dir}/pipe/version`, version);
  if (branch !== "none") fs.writeFileSync(`${dir}/pipe/branch`, branch);
  if (tag !== "none") fs.writeFileSync(`${dir}/pipe/tag`, tag);
  if (channel !== "none") fs.writeFileSync(`${dir}/pipe/channel`, channel);
  return 0;
};
