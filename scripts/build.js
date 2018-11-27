// const fs = require("fs");
const builder = require("electron-builder");
const minimist = require("minimist");
const childProcess = require("child_process");
const prebuild = require("./prebuild");
const postbuild = require("./postbuild");

// constant references
const channels = ["stable", "next", "canary", "dev"];
const platforms = ["w", "m", "l"];
const alts = new Map();
alts.set("stable", ["s", "stable"]);
alts.set("next", ["n", "next"]);
alts.set("canary", ["c", "canary"]);
alts.set("dev", ["d", "dev"]);
alts.set("w", ["w", "win", "windows"]);
alts.set("m", ["m", "mac", "macintosh", "macos", "o", "osx", "darwin"]);
alts.set("l", ["l", "lin", "linux"]);

// Parameters object to be used for prebuild and build
const params = {
  "platform": "",
  "channel": "",
  "preTag": "v0.5.0",
  "projectName": "",
  "projectOwner": "",
  "sourceMessage": "",
  "forcePatch": false,
  "buildID": 0
};
/**
 * Validates a channel input, and exits program if it cannot be processed
 * @param  {string} rawChannel - The raw input for channel parameter
 * @return {string} The calculated channel value
 */
const procChannel = (rawChannel) => {
  let channel = rawChannel;
  channel = channel.replace(/undefined/g, "").toLowerCase();
  for (const i in channels) {
    // Replace alt values
    if (alts.get(channels[i]).contains(channel)) {
      channel = channels[i];
    }
  }
  if (channel === "") {
    console.log(" Channel was not defined. Defaulting to canary.");
    channel = "canary";
  } else if (!channels.includes(channel)) {
    console.error("ERROR: Channel must be either canary, next, stable or dev.");
    process.exit(1);
  }
  return channel;
};

/**
 * Validates a platform input, and exits program if it cannot be processed
 * @param  {string} rawPlatform - The raw input for platform parameter
 * @return {string} The calculated platform value
 */
const procPlatform = (rawPlatform) => {
  let platform = rawPlatform;
  platform = platform.replace(/undefined/g, "").toLowerCase();
  for (const i in platforms) {
    // Replace alt values
    if (alts.get(platforms[i]).contains(platform)) {
      platform = platforms[i];
    }
  }
  if (platform === "") {
    switch (process.platform) {
      case "linux":
        platform = "l";
        break;
      case "darwin":
        platform = "m";
        break;
      case "win32":
        platform = "w";
        break;
      default:
        console.error(
          "ERROR: This platform is unrecognized. If this is a windows, mac or linux platform and you are seeing this message, please contact the project owner."
        );
        process.exit(1);
        break;
    }
  } else if (!platforms.includes(platform)) {
    console.error(
      "ERROR: Platform must be either windows, linux, mac, or an acceptable variant."
    );
    process.exit(1);
  }
  return platform;
};

/**
 * Grabs values from process environment and returns them in an object
 * @return {object} {projectName, projectOwner, sourceMessage, buildID}
 */
const procEnv = () => {
  const env = {
    "projectName": "projectName",
    "projectOwner": "projectOwner",
    "sourceMessage": "foobar",
    "buildID": 270
  };
  if (process.env.git_project_name !== undefined) env.projectName = process.env.git_project_name;
  if (process.env.git_project_owner !== undefined) env.projectOwner = process.env.git_project_owner;
  if (process.env.BUILD_SOURCEVERSIONMESSAGE !== undefined) env.sourceMessage = process.env.BUILD_SOURCEVERSIONMESSAGE;
  if (process.env["Build.BuildId"] !== undefined) env.buildID = process.env["Build.BuildId"];
  return env;
};

const argv = minimist(process.argv.slice(2));

// Help printout
if (argv.help || argv.h || argv._.includes("help")) {
  console.log(`Usage: node scripts/build.js [options]

  Where [options] are:
  --channel stable - Can be canary, next, stable or dev. Dev will launch the dev environment rather than creating a build. Defaults to canary.
  --platform win - Can be win, mac or lin. No platform will default to current system
  --preTag v0.5.0 - The tag of the previous release. Defaults to v0.5.0
  --forcePatch false - Whether to force the build to be a patch
  `);
  process.exit(0);
}

params.channel = procChannel(argv.channel);
params.platform = procPlatform(argv.platform);
if (argv.preTag !== "") params.preTag = argv.preTag;
Object.assign(params, procEnv());

/*
TODO:
Create child process for react devtools
Create child process for electron-webpack dev environment (with port)
If webpack dev-environment is closed, terminate devtools and exit application
 */
prebuild.default(params);
if (params.channel === "dev") {
  // Dev server
  const devtools = childProcess.exec("npm run react-devtools");
  const electronServer = childProcess.exec("npm run webpack-dev");

  // Electron server stuffs
  electronServer.on("exit", () => {
    devtools.kill("SIGSTOP");
  });
  electronServer.stdout.on("data", (chunk) => {
    console.log(chunk);
  });
  electronServer.stderr.on("data", (chunk) => {
    console.error(chunk);
  });

  // React devtools stuffs
  devtools.stdout.on("data", (chunk) => {
    console.log(chunk);
  });
  devtools.stderr.on("data", (chunk) => {
    console.error(chunk);
  });

  // TODO: On close of both, run postbuild task
} else {
  // Build for channel

  console.log(
    `build -${argv.platform} --x64 --ia32 -c config/${argv.channel}.json`
  );
  // builder.build(`build -${plats} --x64 --ia32 -c config/${channel}.json`);
  builder.build(`--c config/${argv.channel}.json`).then(() => {
    postbuild.default();
  });
}
