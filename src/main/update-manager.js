import { autoUpdater } from "electron-updater";
import { ipcBroadcast } from "./ipc";

// TODO: Lotsa docs

export default class updateManager {
  constructor(windowMan) {
    this.windowManager = windowMan;

    this.versionDetails = {
      "versions": process.versions,
      "nodeVersion": process.version,
      "os": process.platform,
      "arch": process.arch,
      "appVersion": autoUpdater.currentVersion,
    };

    this.updateDetails = {
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

  ipcSendVer(recipient) {
    recipient.send("getVer", this.versionDetails);
  }

  get provider() {
    const provider = this.providerBase;
    if (this.versionDetails.appVersion.prerelease === []) {
      provider.url = `${this.providerBase.url}/stable`;
    } else {
      provider.url = `${this.providerBase.url}/${
        this.versionDetails.appVersion.prerelease[0]
      }`;
    }
    return provider;
  }

  initialize() {
    // eslint-disable-next-line global-require
    autoUpdater.logger = require("electron-log");

    autoUpdater.logger.transports.file.level = "debug";
    autoUpdater.autoDownload = false;
    autoUpdater.setFeedURL(this.provider);
  }

  _registerListeners() {
    autoUpdater.on("checking-for-update", () => {
      this.updateDetails.status = "checking";
      ipcBroadcast({ "channel": "updaterChangeStatus", "windows": this.windowManager.windows });
    });

    autoUpdater.on("update-available", (info) => {
      this.updateDetails.status = "available";
      this.updateDetails.updateInfo = info;
      this.updateDetails.hasUpdate = true;
      ipcBroadcast({ "channel": "updaterChangeStatus" });
    });

    autoUpdater.on("update-not-available", (info) => {
      this.updateDetails.status = "notAvailable";
      this.updateDetails.updateInfo = info;
      this.updateDetails.hasUpdate = false;
      ipcBroadcast({ "channel": "updaterChangeStatus" });
    });

    autoUpdater.on("error", (error) => {
      this.updateDetails.status = "error";
      this.updateDetails.error = error;
      ipcBroadcast({ "channel": "updaterChangeStatus" });
    });

    autoUpdater.on("download-progress", (progressObj) => {
      this.updateDetails.status = "progressing";
      this.updateDetails.progressInfo = progressObj;
      ipcBroadcast({ "channel": "updaterChangeStatus" });
    });

    autoUpdater.on("update-downloaded", (info) => {
      this.updateDetails.isDownloaded = true;
      this.updateDetails.updateInfo = info;
      this.updateDetails.status = "downloaded";
      ipcBroadcast({ "channel": "updaterChangeStatus" });
    });
  }
}
