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
  "pretag": "v0.5.0",
  "projectName": "",
  "projectOwner": "",
  "sourceMessage": "",
  "forcepatch": false,
  "norestore": false,
  "buildID": 0
};
/**
 * Validates a channel input, and exits program if it cannot be processed
 * @param  {string} rawChannel - The raw input for channel parameter
 * @return {string} The calculated channel value
 */
const procChannel = (rawChannel) => {
  let channel = `${rawChannel}`;
  channel = channel.replace(/undefined/g, "").toLowerCase();
  for (const i in channels) {
    // Replace alt values
    if (alts.get(channels[i]).includes(channel)) {
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
  let platform = `${rawPlatform}`;
  platform = platform.replace(/undefined/g, "").toLowerCase();
  for (const i in platforms) {
    // Replace alt values
    if (alts.get(platforms[i]).includes(platform)) {
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
    "buildID": 270,
    "forcepatch": false
  };
  if (process.env.git_project_name !== undefined) env.projectName = process.env.git_project_name;
  if (process.env.git_project_owner !== undefined) env.projectOwner = process.env.git_project_owner;
  if (process.env.BUILD_SOURCEVERSIONMESSAGE !== undefined) env.sourceMessage = process.env.BUILD_SOURCEVERSIONMESSAGE;
  if (process.env["Build.BuildId"] !== undefined) env.buildID = process.env["Build.BuildId"];
  if (process.env.FORCEPATCH !== undefined) env.forcepatch = process.env.FORCEPATCH;
  return env;
};
const argv = minimist(process.argv.slice(2));

// Help printout
if (argv.help || argv.h || argv._.includes("help")) {
  console.log(`Usage: node scripts/build.js [options]

  Where [options] are:
  --channel stable - Can be canary, next, stable or dev. Dev will launch the dev environment rather than creating a build. Defaults to canary.
  --platform win - Can be win, mac or lin. No platform will default to current system
  --pretag v0.5.0 - The tag of the previous release. Defaults to v0.5.0
  --forcepatch - Flag will force build to be a patch
  --norestore - Prevents package.json and build configs from being restored at end of build.

  NOTE: Do NOT modify package.json or any channel config files while this script is running, as any changes WILL be overridden on exit!
  `);
  process.exit(0);
}
console.log("Step: Validating inputs");
params.channel = procChannel(argv.channel);
params.platform = procPlatform(argv.platform);
if (argv.pretag != undefined) params.pretag = argv.pretag;
Object.assign(params, procEnv());
if (argv.forcepatch != undefined) params.forcepatch = argv.forcepatch; // Override env forcepatch if arg is used
if (argv.norestore != undefined) params.norestore = argv.norestore;

console.log(`Calculated parameters to be used:`);
console.log(`Channel: ${params.channel}`);
console.log(`Platform: ${params.platform}`);
console.log(`pretag: ${params.pretag}`);
console.log(`forcepatch: ${params.forcepatch}`);
console.log(`forcepatch: ${params.norestore}`);
console.log(`projectName: ${params.projectName}`);
console.log(`projectOwner: ${params.projectOwner}`);
console.log(`buildID: ${params.buildID}`);
console.log(`sourceMessage: ${params.sourceMessage}`);

console.log("Step: Running prebuild task");
prebuild.default(params);

const pids = [];

console.log("Step: Running prebuild clean process");
const preCleaner = childProcess.exec("npm run clean && npm run pack");
pids.push(preCleaner.pid);

preCleaner.stdout.on("data", (chunk) => {
  console.log(chunk);
});

preCleaner.stderr.on("data", (chunk) => {
  console.error(`Error: ${chunk}`);
});

preCleaner.on("close", (code) => {
  // preCleaner.removeAllListeners();
  if (code !== 0) {
    console.error(
      "ERROR: Prebuild clean process exited with a non-zero result. Aborting build!"
    );
    process.exit(1);
  }

  // Build for channel
  console.log(`Step: Channel is ${params.channel}! Running electron-builder`);
  const builder = childProcess.exec(
    `npx electron-builder -${params.platform} --x64 --ia32 -c config/${
      params.channel
    }.json`
  );
  pids.push(builder.pid);
  builder.stdout.on("data", (chunk) => {
    console.log(chunk);
  });
  builder.stderr.on("data", (chunk) => {
    console.error(`Error: ${chunk}`);
  });
});

process.on("beforeExit", () => {
  if (params.norestore) {
    console.log(
      `Step: Build process is finished, however "norestore" flag has been set. Postbuild task will not be run.`
    );
  } else {
    console.log(`Step: Build process is finished. Running postbuild task.`);
    postbuild.default();
  }

  console.log("Process Exiting. Terminating subprocesses...");
  for (const i in pids) {
    console.log(`Terminating process with pid ${pids[i]}`);
    try {
      process.kill(pids[i]);
    } catch (e) {
      console.log(`Unable to kill process! Maybe it's already closed?`);
      console.log(JSON.stringify(e, null, 2));
    }
  }
});
