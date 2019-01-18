import { app /* BrowserWindow */ } from "electron";
import { autoUpdater } from "electron-updater";
import log4js from "log4js";
import Path from "path";


// import WindowManager from "./modules/window-manager";
// import UpdateManager from "./modules/update-manager";
import MainConfig from "./modules/config-manager";


const isDevelopment = process.env.NODE_ENV !== "production";

// Set app name if unpackaged
if (!app.isPackaged) {
  app.setName("Auto Update Test - dev");
}
app.setPath("userData", Path.join(app.getPath("appData"), app.getName()));

app.setPath("logs", Path.join(app.getPath("userData"), "logs"));

// Create app file path
// try {


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
      "filename": `${Path.join(app.getPath("logs"), "main.log")}`,
      "numBackups": 5,
    },
    "errorFile": {
      "type": "file",
      "filename": `${Path.join(app.getPath("logs"), "error.log")}`,
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
autoUpdater.logger = log4js.getLogger("updater");

Log.info(
  `${
    app.isPackaged
      ? "App is packaged, likely a production environment."
      : "App is NOT packaged! Using dev configuration"
  }`
);
Log.info(`Begin log for application: ${app.getName()}`);
Log.info(`Working directory: ${app.getPath("userData")}`);
Log.info(`Logging to ${app.getPath("logs")}`);


const configManager = new MainConfig(isDevelopment);
configManager.preinit().then(() => {

});
/*
const windowManager = new WindowManager(isDevelopment, configManager);
const updateManager = new UpdateManager(isDevelopment, configManager, windowManager);
configManager.init()
  .then(() => {
    windowManager.init();
  }).then(() => {
    updateManager.init();
  }).then(() => {
    // More app start stuff
  });
  const { updateDetails, versionDetails } = updateManager;
// */

// Log.info(`Environment:`);
// Log.info(versionDetails);


// const windowManager = new WindowManager(isDevelopment, configManager);
// const updateManager = new UpdateManager(windowManager);

// // Runs autoupdater and then launches app
// app.on("ready", () => {
//   if (!isDevelopment) {
//     autoUpdater.checkForUpdates();
//   }
//   windowManager.start();
// });

// // Quit when all windows are closed.
// app.on("window-all-closed", () => {
//   if (process.platform !== "darwin") {
//     app.quit();
//   }
// });

// // If no windows are open but app is still running (mac os)
// app.on("activate", () => {
//   if (BrowserWindow.getAllWindows() === []) {
//     windowManager.createMain();
//   }
// });

// app.on("will-quit", (event) => {
//   if (updateDetails.isDownloaded && !updateDetails.isInstalling) {
//     event.preventDefault();
//     updateDetails.isInstalling = true;
//     autoUpdater.quitAndInstall(true, false);
//   }
// });
