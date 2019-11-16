import autoUpdater from "electron-updater";

// If a property needs custom handling, it can be made private and publicly replaced with a getter and setter
class Store {
  constructor() {
    this.started = false; // Will be set to true when there are no updates available
    this.tries = 0;
    this.maxTries = 3;

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

    this.providerBase = {
      "provider": "generic",
      "url":
    "https://raw.githubusercontent.com/Hexellate/tracking/master/autoupdate-test/updates",
      "useMultipleRangeRequest": false,
    };
  }

  get Provider() {
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
}

export default new Store();
