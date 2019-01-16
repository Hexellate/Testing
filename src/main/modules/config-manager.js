import { app } from "electron";
import * as Path from "path";
import fs from "fs";
// import ajv from "ajv";
import lock from "proper-lockfile";
import { sync as atomicWriteSync } from "write-file-atomic";
import ConfigTransformer from "./configManager/transformer";

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

    // Lock config file
    try { // TODO: Test this with non-existant config file
      lock.lockSync(Path.join(this._configPath, this._mainConfig));
    } catch (err) {
      console.error("ERROR: Unable to attain lock on config file:");
      console.error(`${err.name}: ${err.message}`);
      console.error("Exiting...");
      app.exit(1);
    }

    // Make config directories
    try {
      fs.mkdirSync(this._configPath, { "recursive": true });
    } catch (err) {
      console.error(`Unable to make directory "${this._configPath}":`);
      console.error(`${err.name}: ${err.message}`);
      app.exit(1);
    }

    this._config = this._loadConfigSync();
    this._writeConfigSync();
  }

  /**
   * Loads config file and performs all necessary migrations
   */
  _loadConfigSync() { // TODO: On parse fail, try to read from backup instead of crashing (and then crash). Backup system needs to exist first
    let cfg;
    if (lock.checkSync(Path.join(this._configPath, this._mainConfig))) {
      const raw = fs.readFileSync(Path.join(this._configPath, this._mainConfig));

      try {
        cfg = JSON.parse(raw);

        if (typeof cfg !== "object") {
          cfg = { "configVersion": 0 };
        }

        cfg = this._transformer.transform(cfg);
      } catch (err) {
        console.error("ERROR: Failed to parse config file:");
        console.error(`${err.name}: ${err.message}`);
        console.error("Exiting...");
        app.exit(1);
      }
    } else {
      console.error("ERROR: Lock on config file is not active!");
      console.error("Exiting...");
      app.exit(1);
    }
    return cfg;
  }

  _writeConfigSync() {
    try {
      atomicWriteSync(JSON.stringify(this._config, null, 2), Path.join(this._configPath, this._mainConfig));
      // atomicWriteSync(JSON.stringify(this._config, null, 2), Path.join(this._configPath, "backups", this._mainConfig)); // TODO: Write backup file. Need to decide on naming convention that can be used to sequentially test all backups and purge old backups (keep max 2?). Do not create multiple backups per session (maybe move to init?)
    } catch (err) {
      console.error("Failed to write config file:");
      console.error(`${err.name}: ${err.message}`);
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
