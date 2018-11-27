// const fs = require("fs");
// const builder = require("electron-builder");
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
  NOTE: Do NOT modify package.json or any channel config files while this script is running, as any changes WILL be overridden on exit!
  `);
  process.exit(0);
}
console.log("Step: Validating inputs");
params.channel = procChannel(argv.channel);
params.platform = procPlatform(argv.platform);
if (argv.preTag !== "") params.preTag = argv.preTag;
Object.assign(params, procEnv());
params.forcePatch = argv.forcePatch;

console.log(`Calculated parameters to be used:`);
console.log(`Channel:${params.channel}`);
console.log(`Platform:${params.platform}`);
console.log(`preTag:${params.preTag}`);
console.log(`forcePatch:${params.forcePatch}`);
console.log(`projectName:${params.projectName}`);
console.log(`projectOwner:${params.projectOwner}`);
console.log(`buildID:${params.buildID}`);
console.log(`sourceMessage:${params.sourceMessage}`);

console.log("Step: Running prebuild task");
prebuild.default(params);

console.log("Step: Running prebuild clean process");
const preCleaner = childProcess.exec("npm run clean && npm run pack");

preCleaner.stdout.on("data", (chunk) => {
  console.log(chunk);
});

preCleaner.stderr.on("data", (chunk) => {
  console.error(chunk);
});

preCleaner.on("close", (code) => {
  // preCleaner.removeAllListeners();
  if (code !== 0) {
    console.error(
      "ERROR: Prebuild clean process exited with a non-zero result. Aborting build!"
    );
    postbuild.default();
    process.exit(1);
  }
  if (params.channel === "dev") {
    // Dev server
    console.log(`Step: Channel is ${params.channel}! Running dev server`);
    const devTools = childProcess.exec("npm run react-devtools");
    const electronServer = childProcess.exec("npm run webpack-dev");
    let devToolsClosed = false;
    let electronServerClosed = false;

    // Electron server stuffs
    electronServer.stdout.on("data", (chunk) => {
      console.log(chunk);
    });
    electronServer.stderr.on("data", (chunk) => {
      console.error(chunk);
    });

    // React devtools stuffs
    devTools.stdout.on("data", (chunk) => {
      console.log(chunk);
    });
    devTools.stderr.on("data", (chunk) => {
      console.error(chunk);
    });

    devTools.on("close", () => {
      devToolsClosed = true;
      if (electronServerClosed) {
        console.log(`Step: Dev server is closed. Running postbuild task.`);
        postbuild.default();
      }
    });
    electronServer.on("close", () => {
      electronServerClosed = true;
      if (devToolsClosed) {
        console.log(`Step: Dev server is closed. Running postbuild task.`);
        postbuild.default();
      } else {
        devTools.kill("SIGSTOP");
      }
    });
  } else {
    // Build for channel
    console.log(`Step: Channel is ${params.channel}! Running electron-builder`);

    const builder = childProcess.exec(
      `npx electron-builder -${params.platform} --x64 --ia32 -c config/${
        params.channel
      }.json`
    );
    builder.stdout.on("data", (chunk) => {
      console.log(chunk);
    });
    builder.stderr.on("data", (chunk) => {
      console.error(chunk);
    });

    builder.on("close", () => {
      console.log(`Step: Build process is finished. Running postbuild task.`);
      postbuild.default();
    });
  }
});
