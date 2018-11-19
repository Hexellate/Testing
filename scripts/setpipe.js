const fs = require("fs");
// const yaml = require("js-yaml");

module.exports.default = function ({
  dir = "../pipe",
  dir2 = "unset",
  version = "",
  branch = "none",
  tag = "none",
  channel = "none"
} = {}) {
  // const raw = fs.readFileSync("./package.json");
  // const pkg = JSON.parse(raw);
  fs.writeFileSync(`${dir2}/version`, version);
  if (branch !== "none") fs.writeFileSync(`${dir2}/branch`, branch);
  if (tag !== "none") fs.writeFileSync(`${dir2}/tag`, tag);
  if (channel !== "none") fs.writeFileSync(`${dir2}/channel`, channel);
  return 0;
};
