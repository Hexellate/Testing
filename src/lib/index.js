/**
 * A bunch of random library functions
 * @module lib
 */
import Chance from "chance";
import detectPort from "detect-port";

const chance = new Chance();

/* eslint-disable import/prefer-default-export */
/**
 * Picks a random number within the dynamic port range. Does NOT check or bind port.
 * @param {number} start The minimum port value
 * @param {number} end The maximum port value
 */
export async function pickPort(start = 49152, end = 65535) {
  const port = chance.integer({ "min": start, "max": end });
  const _port = await detectPort(port);
  return _port;
}
