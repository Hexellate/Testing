import { app /* BrowserWindow */ } from "electron";
import { autoUpdater } from "electron-updater";
import log4js from "log4js";
import Path from "path";
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from "electron-devtools-installer";

import { pickPort } from "../lib";

import ConfigManager from "./modules/config-manager";
import windowManager from "./modules/window-manager";
import updateManager from "./modules/update-manager";


let log;

app.once("ready", async () => {
  const isDevelopment = process.env.NODE_ENV !== "production";

  if (isDevelopment) {
    installExtension(REACT_DEVELOPER_TOOLS).then((name) => { log.info(`Added chrome dev extension: ${name}`); })
      .catch((err) => { log.error("Unable to install chrome dev extension: ", err); });
    installExtension(REDUX_DEVTOOLS).then((name) => { log.info(`Added chrome dev extension: ${name}`); })
      .catch((err) => { log.error("Unable to install chrome dev extension: ", err); });
  }

  // Set app name if unpackaged
  if (!app.isPackaged) {
    app.setName("Auto Update Test - dev");
  }
  app.setPath("userData", Path.join(app.getPath("appData"), app.getName()));
  app.setPath("logs", Path.join(app.getPath("userData"), "logs"));

  const logPort = await pickPort();

  // Configure logger
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
      "server": {
        "type": "tcp-server",
        "host": "localhost",
        "port": logPort,
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

  // Init logger
  log = log4js.getLogger("main");
  autoUpdater.logger = log4js.getLogger("autoUpdater");

  // Log startup info
  log.info(
    `${
      app.isPackaged
        ? "App is packaged, likely a production environment."
        : "App is NOT packaged! Using dev configuration"
    }`
  );
  log.info(`Begin log for application: ${app.getName()}`);
  log.info(`Working directory: ${app.getPath("userData")}`);
  log.info(`Logging to ${app.getPath("logs")}`);
  log.info(`Logger listening on port ${logPort}`);

  // Create config manager
  const config = ConfigManager.createManager(isDevelopment, "main");
  // const windowManager = WindowManager.createManager(isDevelopment, "main", logPort);
  // const updateManager = UpdateManager.createManager(isDevelopment, "main");

  const { versionDetails } = updateManager;
  log.info(`Environment:`);
  log.info(versionDetails);

  /*
    Init order:
    >> preinit configs >> preinit windows >> preinit updates
    >> init windows
    >> postinit configs
  */

  // Register initialization listeners
  config.once("preinitialized", () => {
    windowManager.preinit(isDevelopment, logPort);
  });
  windowManager.once("preinitialized", () => {
    updateManager.preinit(isDevelopment);
  });
  updateManager.once("preinitialized", () => {
    log.info("Preinitialization finished.");
    log.info("Starting initialization.");
    windowManager.init();
  });

  windowManager.once("initialized", () => {
    log.info("Initialization finished.");
    log.info("Starting post-initialization.");
    config.postinit();
  });
  config.once("postinitialized", () => {
    log.info("Postinitialization finished.");
  });


  // Begin initialization
  config.preinit();
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  log.info("Exiting...");
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// TODO: Move following to window-manager

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

app.on("will-quit", () => {
  log4js.shutdown();
});
