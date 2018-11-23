const fs = require("fs");
// const yaml = require("js-yaml");

module.exports.default = function ({
  dir = "../pipe",
  version = "none",
  branch = "none",
  tag = "none",
  channel = "none",
  commit = "none"
} = {}) {
  if (branch !== "none") fs.writeFileSync(`${dir}/pipe/version`, version);
  if (branch !== "none") fs.writeFileSync(`${dir}/pipe/branch`, branch);
  if (tag !== "none") fs.writeFileSync(`${dir}/pipe/tag`, tag);
  if (channel !== "none") fs.writeFileSync(`${dir}/pipe/channel`, channel);
  if (commit !== "none") fs.writeFileSync(`${dir}/pipe/commit`, commit);
  return 0;
};
