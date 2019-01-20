import { app } from "electron";
import * as Path from "path";
import fs from "fs";
import { sync as atomicWriteSync } from "write-file-atomic";
import log4js from "log4js";
import * as transformer from "./configManager/transformer";

const log = log4js.getLogger("config");
const managers = {};

/**
 * Manages configuration stuff
 */
class Manager {
  /**
   *
   * @param {boolean} isDev Whether running in a dev environment
   */
  constructor(isDev, type) {
    this._isDev = isDev;
    this._type = type;
    this._configPath = Path.join(app.getPath("userData"), "config");
    this._mainConfig = "config.json";
    // transformer = new ConfigTransformer();
  }

  /**
   * Loads config file for startup (file is reloaded later in postinit stage, after watcher is applied)
   */
  async preinit() {
    log.info("preinitializing config manager.");

    // Make config directories
    try {
      fs.mkdirSync(this._configPath, { "recursive": true }); // Use sync because async uses callback instead of promise, and gets messy
      log.info("Config directory created.");
    } catch (err) {
      switch (err.message.split(":", 1)[0]) {
        case ("EEXIST"):
          log.debug("Config directory already exists.");
          break;
        default:
          log.error(`Unable to make directory "${this._configPath}":`);
          log.error(`${err.name}: ${err.message}`);
          app.exit(1);
      }
    }

    this._config = this._loadConfigSync();
    this._writeConfigSync();
    log.info("Config preinitialized successfully");
  }

  /**
   * Loads config file and performs all necessary migrations
   */
  _loadConfigSync() { // TODO: On parse fail, try to read from backup instead of crashing (and then crash). Backup system needs to exist first
    let cfg;
    let raw;
    try {
      raw = fs.readFileSync(Path.join(this._configPath, this._mainConfig));
      log.info("Config file loaded.");
    } catch (err) {
      switch (err.message.split(":", 1)[0]) {
        case ("ENOENT"):
          log.warn("Config file does not exist. Creating new config.");
          raw = '{ "configVersion": 0 }';
          break;
        default:
          log.error("Failed to load config file:");
          log.error(`${err.name}: ${err.message}`);
          log.error("Exiting...");
          app.exit(1);
      }
    }

    if (raw === "") {
      raw = '{ "configVersion": 0 }';
      log.warn("Config is empty. Creating new config.");
    }

    try {
      cfg = JSON.parse(raw);
      log.debug("Config file parsed as json.");
    } catch (err) {
      log.error("Config file unable to be parsed as json:");
      log.error(`${err.name}: ${err.message}`);
      cfg = { "configVersion": 0 };
      log.warn("Config has been reset.");
    }
    try {
      cfg = transformer.transformSync(cfg);
    } catch (err) {
      log.error("Failed to parse config file:");
      log.error(`${err.name}: ${err.message}`);
      log.error("Exiting...");
      app.exit(1);
    }
    return cfg;
  }

  _writeConfigSync() {
    try {
      atomicWriteSync(Path.join(this._configPath, this._mainConfig), JSON.stringify(this._config, null, 2));
      // atomicWriteSync(Path.join(this._configPath, "backups", this._mainConfig, JSON.stringify(this._config, null, 2))); // TODO: Write backup file. Need to decide on naming convention that can be used to sequentially test all backups and purge old backups (keep max 2?). Do not create multiple backups per session (maybe move to init?)
    } catch (err) {
      log.error("Failed to write config file:");
      log.error(`${err.name}: ${err.message}`);
    }
  }

  // /**
  //  * Modifies the configuration based on a partial config object
  //  * @param {object} changes The object representing the partial tree
  //  * @return {boolean} The success state, either true or false
  //  */
  // async amendConfig(changes) {
  //   // Takes a config object, validates it, and merges it into the tree
  //   let tempcfg = this._config;
  //   tempcfg = { ...changes };
  //   if (transformer.validateSync(tempcfg)) {
  //     this._config = tempcfg;
  //     // Save config, file watcher should pickup on change and send events etc
  //     await this._writeConfig(); // TODO: asynchronous write (need to implement backup system first, as well as simultaneous access)
  //     return true;
  //   }
  //   return false;
  // }

  get config() {
    return this._config.body;
  }
}

/**
 * returns the specified config manager
 * @param {string} type - The identifier for the config manager
 * @returns {Manager}
 */
function getManager(type) {
  return managers[type];
}

/**
 * Creates a new config manager
 * @param {boolean} isDev - Whether in a development environment
 * @param {string} type - The identifier for the config manager
 * @returns {Manager}
 */
function createManager(isDev, type) {
  managers[type] = new Manager(isDev, type);
  return managers[type];
}

export default {
  "getManager": getManager,
  "createManager": createManager,
};
