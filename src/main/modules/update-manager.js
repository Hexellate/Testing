import { autoUpdater } from "electron-updater";
// import { ipcMain, app } from "electron";
import { app } from "electron";
import log4js from "log4js";
import { EventEmitter } from "events";
import ConfigManager from "./config-manager";
import windowManager from "./window-manager";
// import { ipcBroadcast } from "./ipc";

const log = log4js.getLogger("updater");

// const managers = {};


/**
 * Manages checking for and downloading of updates
 */
class Manager extends EventEmitter {
  constructor() {
    super();

    this._started = false; // Will be set to true when there are no updates available
    this._tries = 0;
    this._maxTries = 3;

    this._versionDetails = {
      "versions": process.versions,
      "nodeVersion": process.version,
      "os": process.platform,
      "arch": process.arch,
      "appVersion": autoUpdater.currentVersion,
    };

    this._updateDetails = {
      "status": "",
      "hasUpdate": false,
      "isDownloaded": false,
      "isInstalling": false,
      "updateInfo": {},
      "progressInfo": {},
      "error": {},
      "cancellationToken": "",
    };

    this._providerBase = {
      "provider": "generic",
      "url":
    "https://raw.githubusercontent.com/Hexellate/tracking/master/autoupdate-test/updates",
      "useMultipleRangeRequest": false,
    };
  }

  // Initializers
  /**
   * @param {boolean} isDev Whether the environment is dev or production manager
   * Starts the preinit stage for update manager, which will check for updates, or skip autoupdating completely
   */
  async preinit(isDev) {
    // Starts autoupdate process. When no updates are available or autoupdate is disabled, call windowman.start()
    log.info("Starting update manager init.");
    this._configManager = ConfigManager.getManager("main");
    this._registerListeners();

    this._isDev = isDev;
    autoUpdater.autoDownload = false;
    autoUpdater.setFeedURL(this.provider);
    log.debug(this._configManager);
    if (!this._isDev && !this._configManager.config.updates.autoUpdate) {
      log.info("Starting autoupdater");
      windowManager.splashStatus({ "mode": "text", "text": "Starting updater." });
      autoUpdater.checkForUpdates();
      /*
        - Register listeners for startup
          - Check for updates
            - If updates
              - Download updates
              - Restart
            - If no updates
              - Deregister startup listeners
            - If error
              - Retry 3 times, before acting as no updates
        - Deregister startup listeners
        - Register main listeners
        - Call windowman.start()
      */
    } else {
      log.info("Skipping autoupdate");
      this.emit("preinitialized");
    }
  }

  // Utility

  /**
   *
   * @param {import("electron").BrowserWindow} recipient The target of the version info
   */
  ipcSendVer(recipient) {
    recipient.send("getVer", this.versionDetails);
  }

  /**
   * @return {import("builder-util-runtime").GenericServerOptions} The configured provider
   */
  get provider() {
    const provider = this._providerBase;
    if (this.versionDetails.appVersion.prerelease === []) {
      provider.url = `${this._providerBase.url}/stable`;
    } else {
      provider.url = `${this._providerBase.url}/${
        this.versionDetails.appVersion.prerelease[0]
      }`;
    }
    return provider;
  }

  get updateDetails() {
    return this._updateDetails;
  }

  get versionDetails() {
    return this._versionDetails;
  }

  /**
   * Handles status changes from the autoupdater
   */
  _onUpdStatusChange() {
    /*
      - If init stage
        - Alert splash
      - If running stage
        - Alert all windows
    */
    switch (this._updateDetails.status) {
      case ("checking"):
        if (!this._started) {
          windowManager.splashStatus({ "mode": "text", "text": "Checking for updates." });
        } else {
        // Send to main windows
        }
        break;
      case ("available"):
        if (!this._started) {
          windowManager.splashStatus({ "mode": "text", "text": "Update available." });
          autoUpdater.downloadUpdate();
        } else {
        // Send to main windows
        }
        break;
      case ("notAvailable"):
        if (!this._started) {
          windowManager.splashStatus({ "mode": "text", "text": "No update available." });
          this._started = true;
          windowManager.init();
        } else {
        // Send to main windows
        }
        break;
      case ("error"):
        if (!this._started) {
          if (this._tries < this._maxTries) {
            windowManager.splashStatus({ "mode": "text", "text": "Something went wrong, retrying..." });
            this._maxTries++;
          } else {
            // Skip updates
          }
        } else {
        // Send to main windows
        }
        break;
      case ("progressing"):
        if (!this._started) {
          windowManager.splashStatus({ "mode": "text", "text": "Downloading update, please wait." });
        } else {
        // Send to main windows
        }
        break;
      case ("downloaded"):
        if (!this._started) {
          windowManager.splashStatus({ "mode": "text", "text": "Update downloaded. Will restart and install." });
          autoUpdater.quitAndInstall(true, true);
        } else {
        // Send to main windows
        }
        break;
      default:
        log.error(`Update status "${this._updateDetails.status}" is not supported.`);
        log.error("Exiting...");
        app.exit(1);
        break;
    }
  }

  /**
   * Registers listeners for events from the autoupdater
   */
  _registerListeners() {
    autoUpdater.on("checking-for-update", () => {
      this._updateDetails.status = "checking";
      this._onUpdStatusChange();
    });

    autoUpdater.on("update-available", (info) => {
      this._updateDetails.status = "available";
      this._updateDetails.updateInfo = info;
      this._updateDetails.hasUpdate = true;
      this._onUpdStatusChange();
    });

    autoUpdater.on("update-not-available", (info) => {
      this._updateDetails.status = "notAvailable";
      this._updateDetails.updateInfo = info;
      this._updateDetails.hasUpdate = false;
      this._onUpdStatusChange();
    });

    autoUpdater.on("error", (error) => {
      this._updateDetails.status = "error";
      this._updateDetails.error = error;
      this._onUpdStatusChange();
    });

    autoUpdater.on("download-progress", (progressObj) => {
      this._updateDetails.status = "progressing";
      this._updateDetails.progressInfo = progressObj;
      this._onUpdStatusChange();
    });

    autoUpdater.on("update-downloaded", (info) => {
      this._updateDetails.isDownloaded = true;
      this._updateDetails.updateInfo = info;
      this._updateDetails.status = "downloaded";
      this._onUpdStatusChange();
    });

    // ipcMain.on("getVer", (event) => {
    //   this.ipcSendVer(event.sender);
    // });

    // ipcMain.on("getUpd", (event) => {
    //   autoUpdater.checkForUpdates().then((prom) => {
    //     this.updateDetails.promise = prom;
    //     this.updateDetails.cancellationToken = this.updateDetails.promise.cancellationToken;
    //     this.ipcSendVer(event.sender);
    //   });
    // });

    // ipcMain.on("dlUpd", () => {
    //   autoUpdater.downloadUpdate().then((prom) => {
    //     this.updateDetails.promise = prom;
    //     this.updateDetails.hasdlpromisereturned = true;
    //   });
    //   this.updateDetails.status = "progressing";
    //   ipcBroadcast({ "channel": "updaterChangeStatus", "windows": this._windowManager.windows });
    // });

    // ipcMain.on("installUpdate", () => {
    //   autoUpdater.quitAndInstall();
    // });
  }
}

// /**
//  * returns the specified update manager
//  * @param {string} type - The identifier for the update manager
//  * @returns {Manager}
//  */
// function getManager(type) {
//   if (type !== null) {
//     return managers[type];
//   }
//   return managers.main;
// }

// /**
//  * Creates a new update manager
//  * @param {boolean} isDev - Whether in a development environment
//  * @param {string} type - The identifier for the update manager
//  * @returns {Manager}
//  */
// function createManager(isDev, type) {
//   managers[type] = new Manager(isDev, type);
//   return managers[type];
// }

// export default {
//   "getManager": getManager,
//   "createManager": createManager,
// };

export default new Manager();
