import { app } from "electron";
import * as Path from "path";
import fs from "fs";
// import ajv from "ajv";
import { sync as atomicWriteSync } from "write-file-atomic";
import log4js from "log4js";
import ConfigTransformer from "./configManager/transformer";

const log = log4js.getLogger("config");

// NOTE: Reimplementing manager for main only, other configs can be introduced later as needed

/**
 * Manages configuration stuff
 */
export default class configManager {
  /**
   *
   * @param {boolean} isDev Whether running in a dev environment
   */
  constructor(isDev) {
    this._isDev = isDev;
    // this._config = {};
    this._configPath = Path.join(app.getPath("userData"), "config");
    this._mainConfig = "config.json";
    this._transformer = new ConfigTransformer();
  }

  /**
   * Loads config file for startup (file is reloaded later in postinit stage, after watcher is applied)
   */
  async preinit() {
    log.info("preinitializing config manager.");
    /*

    */
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
      cfg = this._transformer.transform(cfg);
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
      // atomicWriteSync(JSON.stringify(this._config, null, 2), Path.join(this._configPath, "backups", this._mainConfig)); // TODO: Write backup file. Need to decide on naming convention that can be used to sequentially test all backups and purge old backups (keep max 2?). Do not create multiple backups per session (maybe move to init?)
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
  //   if (this._transformer.validateSync(tempcfg)) {
  //     this._config = tempcfg;
  //     // Save config, file watcher should pickup on change and send events etc
  //     await this._writeConfig(); // TODO: asynchronous write (need to implement backup system first, as well as simultaneous access)
  //     return true;
  //   }
  //   return false;
  // }

  get config() {
    return this._config.config;
  }
}
