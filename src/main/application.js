/**
 * The main application
 * @module application
 */

import { app } from "electron";
import { autoUpdater } from "electron-updater";
import log4js from "log4js";
import Path from "path";
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from "electron-devtools-installer";

import { pickPort } from "../util";

import Config from "./lib/config";
import WindowManager from "./lib/windows";
import UpdateManager from "./lib/updater";


let log;
let logPort;
let config;

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

// TODO: Move logger to module
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

async function preinit() {
  log.info("Starting preinitialization.");
  await config.preinit();
  await WindowManager.preinit(logPort);
  await UpdateManager.preinit();
  log.info("Preinitialization finished.");
}

async function init() {
  log.info("Starting initialization.");
  await WindowManager.init();
  log.info("Initialization finished.");
}

async function postinit() {
  log.info("Starting post-initialization.");
  await config.postinit();
  log.info("Postinitialization finished.");
}

async function handleReady() {
  // Set app name if unpackaged
  if (!app.isPackaged) {
    app.setName("Auto Update Test - dev");
  }
  setPaths();

  // Logger init
  logPort = await startLogger();
  autoUpdater.logger = log4js.getLogger("autoUpdater");

  // Create config manager
  config = Config.createManager("main");

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

  const { versionDetails } = UpdateManager;
  log.info(`Environment:`);
  log.info(versionDetails);

  // Initialization sequence
  await preinit();
  await init();
  await postinit();
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
 * @typedef appOptions
 * @global
 * @type {object}
 * @property {string} devName The application name to use if in development mode
 * @property {boolean} multiWindow Whether the application should allow multiple instance windows
 * @property {boolean} background Whether to run the background task for the application
 * @property {object} tray Options for tray icon
 * @property {boolean} tray.enabled Whether to use a tray icon
 */


// TODO: Figure out how to do stuff for recent files in windows jumplist (And where to expose the api)

// TODO: Add more options, set defaults and separate related options into nested objects
/**
 * Starts the application
 * @param {appOptions} appOptions The set of options and settings to run the application with
 */
async function start(appOptions) {
  const opts = {
    "devName": "devName",
    "multiWindow": false,
    "background": false,
    "tray": {
      "enabled": true,
    },
    ...appOptions,
  };

  /**
   * Contains all the application options as defined in the entry module
 * @global
 * @type {appOptions}
 */
  global.appOpts = opts;
  app.once("ready", handleReady);
  app.on("window-all-closed", handleWindowAllClosed);
  app.on("will-quit", handleWillQuit);
}
export default {
  "start": start,
};
