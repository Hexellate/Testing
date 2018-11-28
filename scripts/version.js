const semver = require("semver");
const fs = require("fs");

/**
 * Bump the version in package.json
 * @param {string} [bump=patch] - The component to increment. Can be major, minor, patch or prerelease. Defaults to patch
 * @return {boolean} success - True if function succeeded, false if not
 */
export function bump({ comp = "patch" } = {}) {
  const raw = fs.readFileSync("./package.json");
  const pkg = JSON.parse(raw);
  const newver = semver.inc(pkg.version, comp);
  if (newver === null) {
    throw new TypeError("Expecting a semver string but got null!");
  }
  console.log(`comp ${pkg.version} to ${newver}`);
  pkg.version = newver;
  fs.writeFileSync("./package.json", JSON.stringify(pkg, null, 2));
  return 0;
}

/**
 * Returns either the value of a version component, or the whole version.
 * @param {string} [comp] - The component to return. Can be major, minor, patch, channel, prerelease, full or trunc. Defaults to full
 * @return {string | integer} The component value requested
 */
export function get(comp) {
  const raw = fs.readFileSync("./package.json");
  const pkg = JSON.parse(raw);
  // Version parts
  const major = semver.major(pkg.version);
  const minor = semver.minor(pkg.version);
  const patch = semver.patch(pkg.version);

  let channel = "stable";
  let pre = 0;
  if (semver.prerelease(pkg.version) != null) {
    [channel, pre] = semver.prerelease(pkg.version);
  }

  let ver;
  switch (comp) {
    case "major":
      ver = major;
      break;
    case "minor":
      ver = minor;
      break;
    case "patch":
      ver = patch;
      break;
    case "channel":
      ver = channel;
      break;
    case "pre":
    case "prerelease":
      ver = pre;
      break;
    case "trunc":
      ver = `${major}.${minor}.${patch}`;
      break;
    default:
    case "full":
      ver = pkg.version;
      break;
  }

  return ver;
}

/**
 * Changes the version in package.json
 * @param  {string} [channel=undefined] - The channel component
 * @param  {integer} [major=undefined] - The major component
 * @param  {integer} [minor=undefined] - The minor component
 * @param  {integer} [patch=undefined] - The patch component
 * @param  {integer} [pre=undefined] - The prerelease component
 * @param  {string} [full=undefined] - A full version string
 * @param  {boolean} [trunc=undefined] - Whether to truncate the prerelease component. No value will determine automatically based on channel
 * @param  {boolean} [coerce=true] - Whether to try and coerce the full value
 * @return {boolean} success - True if function succeeded, false if not
 */
export function set({
  channel = undefined,
  major = undefined,
  minor = undefined,
  patch = undefined,
  pre = undefined,
  full = undefined,
  trunc = undefined,
  coerce = true
} = {}) {
  const raw = fs.readFileSync("./package.json");
  const pkg = JSON.parse(raw);
  // Version parts
  const newProps = {};
  if (channel === undefined) {
    newProps.channel = semver.prerelease(pkg.version) === []
      ? "stable"
      : semver.prerelease(pkg.version)[0];
  } else {
    newProps.channel = channel;
  }

  if (major === undefined) {
    newProps.major = semver.major(pkg.version);
  } else {
    newProps.major = major;
  }

  if (minor === undefined) {
    newProps.minor = semver.minor(pkg.version);
  } else {
    newProps.minor = minor;
  }

  if (patch === undefined) {
    newProps.patch = semver.patch(pkg.version);
  } else {
    newProps.patch = patch;
  }

  if (semver.prerelease(pkg.version) != null && pre === undefined) {
    [, newProps.pre] = semver.prerelease(pkg.version);
  } else {
    newProps.pre = pre;
  }

  newProps.full = full;
  if (full !== undefined && coerce) {
    newProps.full = semver.coerce(full);
  }

  // Truncate if not manually set and channel is stable
  newProps.trunc = trunc;
  if (newProps.trunc === undefined) {
    newProps.trunc = newProps.channel.toLowerCase() === "stable";
  }

  let newver;
  if (newProps.trunc) {
    newver = `${newProps.major}.${newProps.minor}.${newProps.patch}`;
  } else {
    newver = `${newProps.major}.${newProps.minor}.${newProps.patch}-${
      newProps.channel
    }.${newProps.pre}`;
  }
  if (newProps.full !== undefined) {
    newver = newProps.full;
  }
  console.log(`change ${pkg.version} to ${newver}`);
  pkg.version = newver;
  fs.writeFileSync("./package.json", JSON.stringify(pkg, null, 2));
  return 0;
}
