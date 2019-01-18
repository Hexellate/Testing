import { app, BrowserWindow } from "electron";
import { autoUpdater } from "electron-updater";
import log4js from "log4js";
// import Path from "path";


import WindowManager from "./modules/window-manager";
import UpdateManager from "./modules/update-manager";
import MainConfig from "./modules/config-manager";


const isDevelopment = process.env.NODE_ENV !== "production";

// Set app name if unpackaged
if (!app.isPackaged) {
  app.setName("Auto Update Test - dev");
}

// Create app file path
// try {
//   app.setPath("userData", Path.join(app.getPath("appData"), app.getName()));

//   // Make dir userData
//   try {
//     fs.mkdirSync(app.getPath("userData", { recursive: true }));
//   } catch (err) {
//     console.error(`Unable to make directory "${app.getPath("userData")}":`);
//     console.error(`${err.name}: ${err.message}`);
//   }
// } catch (err) {
//   console.error("ERROR: Unable to create userData directory for app:");
//   console.error(`${err.name}: ${err.message}`);
//   console.error("Exiting...");
//   app.exit(1);
// }

log4js.configure({
  "appenders": {
    "console": {
      "type": "console",
    },
    "main": {
      "type": "file",
      "filename": "main.log",
      "numBackups": 5,
    },
    "errorFile": {
      "type": "file",
      "filename": "error.log",
    },
    "errors": {
      "type": "logLevelFilter",
      "level": "ERROR",
      "appender": "errorFile",
    },
  },
  "categories": {
    "default": {
      "appenders": [
        "console",
        "main",
        "errors",
      ],
      "level": "debug",
    },
  },
});

const Log = log4js.getLogger("main");

const configManager = new MainConfig(isDevelopment);

// // initialize log
// Log.transports.file.file = app.getPath("logs");
// Log.transports.file.level = "debug";
// Log.transports.file.format = "{h}:{i}:{s}:{ms} {text}";
Log.info(
  `${
    app.isPackaged
      ? "App is packaged, likely a production environment."
      : "App is NOT packaged! Using dev configuration"
  }`
);
Log.info(`Begin log for application: ${app.getName()}`);
Log.info(`Logging to ${Log.transports.file.file}`);
Log.info(`Environment:`);
// Log.info(versionDetails);


const windowManager = new WindowManager(isDevelopment, configManager);
const updateManager = new UpdateManager(windowManager);
const { updateDetails } = updateManager;
// TODO: Create log wrapper

// Runs autoupdater and then launches app
app.on("ready", () => {
  if (!isDevelopment) {
    autoUpdater.checkForUpdates();
  }
  windowManager.start();
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
    windowManager.createMain();
  }
});

app.on("will-quit", (event) => {
  if (updateDetails.isDownloaded && !updateDetails.isInstalling) {
    event.preventDefault();
    updateDetails.isInstalling = true;
    autoUpdater.quitAndInstall(true, false);
  }
});
