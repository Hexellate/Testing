// const fs = require("fs");
const builder = require("electron-builder");
const minimist = require("minimist");

// Arguments: --platform, --channel,
const channels = ["stable", "next", "canary", "dev"];
const platforms = ["win", "mac", "lin"];
const argv = minimist(process.argv.slice(2));
// console.dir(argv);

if (argv.help || argv.h || argv._.includes("help")) {
  console.log(`Usage: node scripts/build.js [options]

  Where [options] is in:
  -c stable
  --channel stable - Can be canary, next, stable or dev
  -p win
  --platform win - Can be win, mac or lin`);
  process.exit(0);
}

if (argv.platform !== undefined && argv.p !== undefined) {
  console.error("ERROR: platform has been defined twice");
  process.exit(1);
}

if (argv.channel !== undefined && argv.c !== undefined) {
  console.error("ERROR: channel has been defined twice");
  process.exit(1);
}

let channel = `${argv.channel}${argv.c}`;
channel = channel.replace(/undefined/g, "");
let platform = `${argv.platform}${argv.p}`;
platform = platform.replace(/undefined/g, "");
// console.log(channel);
// console.log(platform);

// Validate platform input
if (platform === undefined) {
  console.error("ERROR: Platform was not defined.");
  process.exit(1);
} else if (typeof platform !== "string") {
  console.error("ERROR: Platform must be either win, mac or lin.");
  process.exit(1);
} else if (!platforms.includes(platform.toLowerCase())) {
  console.error("ERROR: Platform must be either win, mac or lin.");
  process.exit(1);
}

// Validate channel input
if (channel === undefined) {
  console.error("ERROR: Channel was not defined.");
  process.exit(1);
} else if (typeof channel !== "string") {
  console.error("ERROR: Channel must be either canary, next, stable or dev.");
  process.exit(1);
} else if (!channels.includes(channel.toLowerCase())) {
  console.error("ERROR: Channel must be either canary, next, stable or dev.");
  process.exit(1);
}

let plats = "";

if (platform === "win") plats += "w";
if (platform === "mac") plats += "m";
if (platform === "lin") plats += "l";

builder.build(` -${plats} --x64 --ia32 -c config/${channel}.json`);
