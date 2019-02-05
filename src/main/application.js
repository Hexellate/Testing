/**
 * The main application
 * @module application
 */

import { app /* BrowserWindow */ } from "electron";
import { autoUpdater } from "electron-updater";
import log4js from "log4js";
import Path from "path";
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from "electron-devtools-installer";

import { pickPort } from "../lib";

import ConfigManager from "./modules/config-manager";
import windowManager from "./modules/window-manager";
import UpdateManager from "./modules/update-manager";


let log;

global.isDev = process.env.NODE_ENV !== "production" || !app.isPackaged;

function installDevTools() {
  if (global.isDev) {
    installExtension(REACT_DEVELOPER_TOOLS).then((name) => { log.info(`Added chrome dev extension: ${name}`); })
      .catch((err) => { log.error("Unable to install chrome dev extension: ", err); });
    installExtension(REDUX_DEVTOOLS).then((name) => { log.info(`Added chrome dev extension: ${name}`); })
      .catch((err) => { log.error("Unable to install chrome dev extension: ", err); });
  }
}

function setPaths() {
  app.setPath("userData", Path.join(app.getPath("appData"), app.getName()));
  app.setPath("logs", Path.join(app.getPath("userData"), "logs"));
}

async function startLogger() {
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
  return logPort;
}

function registerStartSequence(config, logPort) {
  config.once("preinitialized", () => {
    windowManager.preinit(logPort);
  });
  windowManager.once("preinitialized", () => {
    UpdateManager.preinit();
  });
  UpdateManager.once("preinitialized", () => {
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
}

async function handleReady() {
  // Set app name if unpackaged
  if (!app.isPackaged) {
    app.setName("Auto Update Test - dev");
  }
  setPaths();

  // Logger init
  const logPort = await startLogger();
  autoUpdater.logger = log4js.getLogger("autoUpdater");

  installDevTools();

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
  const config = ConfigManager.createManager("main");

  const { versionDetails } = UpdateManager;
  log.info(`Environment:`);
  log.info(versionDetails);

  registerStartSequence(config, logPort);
  config.preinit();
}

async function handleWindowAllClosed() {
  if (process.platform !== "darwin") {
    log.info("Exiting...");
    app.quit();
  }
}

async function handleWillQuit() {
  log4js.shutdown();
}

/**
 * @typedef application:appOptions
 * @type {object}
 * @property {string} devName The application name to use if in development mode
 * @property {boolean} multiWindow Whether the application should allow multiple instance windows
 * @property {boolean} background Whether to run the background task for the application
 * @property {object} tray Options for tray icon
 */

const application = {};

// TODO: Figure out how to do stuff for recent files in windows jumplist (And where to expose the api)

// TODO: Add more options, set defaults and separate related options into nested objects
/**
 * Starts the application
//  * @param {appOptions} options The set of options and settings to run the application with
//  * @param {string} options.devName The application name to use if in development mode
//  * @param {boolean} options.multiWindow Whether the application should allow multiple instance windows
//  * @param {boolean} options.background Whether to run the background task for the application
//  * @param {object} options.tray Options for tray icon
 */
application.start = async (options) => {
// TODO: Separate startup sequence into multiple functions, and move all event listener registrations here
/**
 * @global
 * @type {appOptions}
 */
  global.appOpts = options;
  app.once("ready", handleReady);
  app.on("window-all-closed", handleWindowAllClosed);
  app.on("will-quit", handleWillQuit);
};
export default application;
