import { app, BrowserWindow, ipcMain } from "electron";
import * as Path from "path";
import url from "url";
import { autoUpdater } from "electron-updater";
import Log from "electron-log";
// import semver from "semver";

/** Process initialization */

const isDevelopment = process.env.NODE_ENV !== "production";

// initialize log
Log.transports.file.appName = "test";
Log.transports.file.level = "debug";
Log.transports.file.format = "{h}:{i}:{s}:{ms} {text}";
const logPath = Path.dirname(Log.transports.file.findLogPath());
Log.transports.file.file = Path.join(logPath, "latest.log");

// initialize updater
const versionDetails = {
  "versions": process.versions,
  "nodeVersion": process.version,
  "os": process.platform,
  "arch": process.arch,
  "status": "",
  "hasUpdate": false,
  "isDownloaded": false,
  "isInstalling": false,
  "appVersion": autoUpdater.currentVersion,
  "updateInfo": {},
  "progressInfo": {},
  "error": {},
  "cancellationToken": ""
};

const providerBase = {
  "provider": "generic",
  "url": "https://gitlab.com/Hexellate/releases/raw/master/autoupdate-test"
};

autoUpdater.autoDownload = false;
{
  const provider = providerBase;
  if (versionDetails.appVersion.prerelease === []) {
    provider.url = `${providerBase.url}/stable`;
  } else {
    provider.url = `${providerBase.url}/${
      versionDetails.appVersion.prerelease[0]
    }`;
  }

  autoUpdater.setFeedURL(provider);
  versionDetails.provider = provider;
}

// Keep a global reference of the window object, if you don't, the window will be closed automatically when the JavaScript object is garbage collected.
const windows = [];

Log.info(`Begin Log`);
Log.info(`Logging to ${Log.transports.file.file}`);
Log.info(`Environment:`);
Log.info(versionDetails);

const ipcSendVer = (sender) => {
  sender.send("getVer", versionDetails);
};

const ipcBroadcast = ({ channel = "broadcast", message = {} } = {}) => {
  windows.map(ref => ref.webContents.send(channel, message));
};

function createWindow({
  width = 800,
  height = 600,
  type = "main",
  transparent = false
} = {}) {
  let win = new BrowserWindow({ width, height, transparent });
  windows.push(win);
  win.windowType = type;

  if (isDevelopment) {
    win.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    win.loadURL(
      url.format({
        "pathname": Path.join(__dirname, `index.html`),
        "protocol": "file",
        "slashes": true
      })
    );
  }

  // Open the DevTools.
  if (isDevelopment) {
    win.webContents.openDevTools();
  }
  win.setTitle("Application Name");

  // Emitted when the window is closed.
  win.on("closed", () => {
    win = null;
    windows.splice(windows.indexOf(win), 1);
  });
}

/** Main App Functions */

// Runs autoupdater and then launches app
app.on("ready", () => {
  if (!isDevelopment) {
    autoUpdater.checkForUpdates();
  }
  createWindow({ "type": "updater" });
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// If no windows are open but app is still running (mac os)
app.on("activate", () => {
  if (BrowserWindow.getAllWindows() === []) {
    createWindow();
  }
});

app.on("will-quit", (event) => {
  if (versionDetails.isDownloaded && !versionDetails.isInstalling) {
    event.preventDefault();
    versionDetails.isInstalling = true;
    autoUpdater.quitAndInstall(true, false);
  }
});

/** IPC Functions */

ipcMain.on("changeWindow", (event, arg) => {
  createWindow(arg);
  BrowserWindow.fromWebContents(event.sender).close();
  Log.debug(arg);
  Log.debug(event);
});

ipcMain.on("resizeWindow", (event, arg) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  const { width = 800, height = 600, resizable = win.isResizable() } = arg;
  win.setResizable(resizable);
  win.setSize(width, height, true);
  win.center();
});

ipcMain.on("getVer", (event) => {
  ipcSendVer(event.sender);
});

// ipcMain.on("setChannel", (event, arg) => {
//   autoUpdater.channel = arg;
//   versionDetails.channel = arg;
//   ipcSendVer(event.sender);
// });

ipcMain.on("getUpd", (event) => {
  autoUpdater.checkForUpdates().then((prom) => {
    versionDetails.promise = prom;
    ipcSendVer(event.sender);
  });
});

ipcMain.on("dlUpd", () => {
  autoUpdater.downloadUpdate();
  versionDetails.status = "progressing";
  ipcBroadcast({ "channel": "updaterChangeStatus" });
});

// ipcMain.on("setUpdUrl", (event) => {
//   autoUpdater.setFeedURL({
//     "BintrayOptions": {
//       "provider": "bintray"
//     }
//   });
//   autoUpdater.checkForUpdates().then(ipcSendVer(event.sender));
// });

ipcMain.on("installUpdate", () => {
  autoUpdater.quitAndInstall();
});

/** AutoUpdater Functions */

autoUpdater.on("checking-for-update", () => {
  versionDetails.status = "checking";
  Log.debug(`checking: ${JSON.stringify(versionDetails, null, 2)}`);
  ipcBroadcast({ "channel": "updaterChangeStatus" });
});

autoUpdater.on("update-available", (info) => {
  versionDetails.status = "available";
  versionDetails.updateInfo = info;
  versionDetails.hasUpdate = true;
  Log.debug(`available: ${JSON.stringify(versionDetails, null, 2)}`);
  ipcBroadcast({ "channel": "updaterChangeStatus" });
});

autoUpdater.on("update-not-available", (info) => {
  versionDetails.status = "notAvailable";
  versionDetails.updateInfo = info;
  versionDetails.hasUpdate = false;
  Log.debug(`not available: ${JSON.stringify(versionDetails, null, 2)}`);
  ipcBroadcast({ "channel": "updaterChangeStatus" });
});

autoUpdater.on("error", (error) => {
  versionDetails.status = "error";
  versionDetails.error = error;
  Log.debug(`error: , ${JSON.stringify(versionDetails, null, 2)}`);
  ipcBroadcast({ "channel": "updaterChangeStatus" });
});

autoUpdater.on("download-progress", (progressObj) => {
  versionDetails.status = "progressing";
  versionDetails.progressInfo = progressObj;
  Log.debug(`progressing: ${JSON.stringify(versionDetails, null, 2)}`);
  ipcBroadcast({ "channel": "updaterChangeStatus" });
});

autoUpdater.on("update-downloaded", (info) => {
  versionDetails.isDownloaded = true;
  versionDetails.updateInfo = info;
  versionDetails.status = "downloaded";
  versionDetails.updateInfo = info;
  Log.debug(`downloaded: ${JSON.stringify(versionDetails, null, 2)}`);
  ipcBroadcast({ "channel": "updaterChangeStatus" });
});
