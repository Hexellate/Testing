import { autoUpdater } from "electron-updater";
// import { ipcMain, app } from "electron";
import { app } from "electron";
import log4js from "log4js";
// import { EventEmitter } from "events";
import Config from "../config";
import WindowManager from "../windows";
// import { ipcBroadcast } from "./ipc";
import store from "./dataStore";

const log = log4js.getLogger("updater");
const configManager = Config.getManager("main");

/*
 TODO: providerBase should be given by main
 module should not emit any events as they should all be handled internally. If it needs to trigger things such as a shutdown, or send a message, it should do so internally
*/

/**
 * Handles status changes from the autoupdater
 */
function onUpdStatusChange() {
  /*
      - If init stage
        - Alert splash
      - If running stage
        - Alert all windows
    */
  switch (store.updateDetails.status) {
    case ("checking"):
      if (!store.started) {
        WindowManager.splashStatus({ "mode": "text", "text": "Checking for updates." });
      } else {
        // Send to main windows
      }
      break;
    case ("available"):
      if (!store.started) {
        WindowManager.splashStatus({ "mode": "text", "text": "Update available." });
        autoUpdater.downloadUpdate();
      } else {
        // Send to main windows
      }
      break;
    case ("notAvailable"):
      if (!store.started) {
        WindowManager.splashStatus({ "mode": "text", "text": "No update available." });
        store.started = true;
        WindowManager.init();
      } else {
        // Send to main windows
      }
      break;
    case ("error"):
      if (!store.started) {
        if (store.tries < store.maxTries) {
          WindowManager.splashStatus({ "mode": "text", "text": "Something went wrong, retrying..." });
          store.tries++;
        } else {
          // Skip updates
        }
      } else {
        // Send to main windows
      }
      break;
    case ("progressing"):
      if (!store.started) {
        WindowManager.splashStatus({ "mode": "text", "text": "Downloading update, please wait." });
      } else {
        // Send to main windows
      }
      break;
    case ("downloaded"):
      if (!store.started) {
        WindowManager.splashStatus({ "mode": "text", "text": "Update downloaded. Will restart and install." });
        autoUpdater.quitAndInstall(true, true);
      } else {
        // Send to main windows
      }
      break;
    default:
      log.error(`Update status "${store.updateDetails.status}" is not supported.`);
      log.error("Exiting...");
      app.exit(1);
      break;
  }
}

/**
 * Registers listeners for events from the autoupdater
 */
function registerListeners() {
  autoUpdater.on("checking-for-update", () => {
    store.updateDetails.status = "checking";
    onUpdStatusChange();
  });

  autoUpdater.on("update-available", (info) => {
    store.updateDetails.status = "available";
    store.updateDetails.updateInfo = info;
    store.updateDetails.hasUpdate = true;
    onUpdStatusChange();
  });

  autoUpdater.on("update-not-available", (info) => {
    store.updateDetails.status = "notAvailable";
    store.updateDetails.updateInfo = info;
    store.updateDetails.hasUpdate = false;
    onUpdStatusChange();
  });

  autoUpdater.on("error", (error) => {
    store.updateDetails.status = "error";
    store.updateDetails.error = error;
    onUpdStatusChange();
  });

  autoUpdater.on("download-progress", (progressObj) => {
    store.updateDetails.status = "progressing";
    store.updateDetails.progressInfo = progressObj;
    onUpdStatusChange();
  });

  autoUpdater.on("update-downloaded", (info) => {
    store.updateDetails.isDownloaded = true;
    store.updateDetails.updateInfo = info;
    store.updateDetails.status = "downloaded";
    onUpdStatusChange();
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

/**
 * Starts the update manager, which will check for updates, or skip autoupdating completely
 */
async function start() {
  // Starts autoupdate process. When no updates are available or autoupdate is disabled, call windowman.start()
  log.info("Starting update manager init.");
  registerListeners();

  autoUpdater.autoDownload = false;
  autoUpdater.setFeedURL(store.provider);
  log.debug(configManager);
  if (!global.isDev && !configManager.config.updates.autoUpdate) {
    log.info("Starting autoupdater");
    WindowManager.splashStatus({ "mode": "text", "text": "Starting updater." });
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
      */
  } else {
    log.info("Skipping autoupdate");
  }
}

// /**
//    *
//    * @param {BrowserWindow} recipient The target of the version info
//    * @deprecated
//    */
// function ipcSendVer(recipient) {
//   recipient.send("getVer", store.versionDetails);
// }


export { start };
