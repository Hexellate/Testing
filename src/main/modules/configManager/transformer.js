import _ from "lodash";
import Ajv from "ajv"; // JSON verification library
import log4js from "log4js";
import * as Transformers from "./transformers";

const log = log4js.getLogger("config-transformers");
const type = "main";
const ajv = new Ajv({ "allErrors": true, "useDefaults": true });

// TODO: Change back to class to support multiple config types (currently though there is only one config type in use)

/**
   * Returns the config schema for the given version
   * @param {number} version The schema version to get
   */
function getSchema(version) {
  return Transformers.schemaMatrix[type][`v${version}`];
}

/**
 * Returns the latest config version
   * @return {number} The latest available config version
   */
function getLatest() {
  return _.max(Transformers.versions[type]);
}

/**
   * Performs a non-mutating validation on the given config
   * @param {object} config The configuration object to validate
   * @param {number} version The schema version to validate against
   */
export async function validate(config, version) {
  const test = await ajv.compileAsync(getSchema(version));
  if (test(config)) {
    return true;
  }
  return test.errors;
}

/**
   * Performs a synchronous non-mutating validation on the given config
   * @param {object} config The configuration object to validate
   * @param {number} version The schema version to validate against
   */
export function validateSync(config, version) {
  const test = ajv.compile(getSchema(version));
  if (test(config)) {
    return true;
  }
  return test.errors;
}

/**
   * Transforms the given configuration to the latest version
   * @param {object} config The config object to transform
   */
export function transformSync(config) { // TODO: Implement checksum stuff
  const cVer = config.configVersion;
  const latest = getLatest();
  log.info(`Config is version ${cVer}, latest is ${latest}`);

  // Check if config version is lower than latest
  if (cVer < latest) {
    let newConfig = config;
    log.info("Converting config to latest version");

    // Incrementally transform config through each version
    for (let i = cVer + 1; i <= latest; i++) {
      newConfig = Transformers.converterMatrix[type][`v${i}`](newConfig);

      log.info(`Config transformed from ${cVer} to ${cVer + 1}`);
      log.debug(`New config:`);
      log.debug(JSON.stringify(newConfig, null, 2));

      // Validate config
      const validated = validateSync(newConfig, i);
      if (validated !== true) {
        throw new SyntaxError(`Config file ${type} failed to validate after transformation from ${i - 1} to ${i}: ${JSON.stringify(validated, null, 2)}`);
      }
    }
    return newConfig;
  }

  // Validates config if no transform is needed
  const validated = validateSync(config, cVer);
  if (validated !== true) {
    throw new SyntaxError(`Config file ${type} failed to validate: ${JSON.stringify(validated, null, 2)}`);
  } else {
    log.info("Config file validated successfully.");
  }
  return config;
}
