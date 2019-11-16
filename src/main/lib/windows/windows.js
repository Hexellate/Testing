/**
 * @file Manages application windows
 */

import { BrowserWindow, ipcMain } from "electron";
// import url from "url";
// import * as Path from "path";
import log4js from "log4js";
import { EventEmitter } from "events";
import Config from "../config";
import WindowStore from "./windowStore";
// import { createWindow } from "./windowLib";
// import * as foreground from "./foreground";
// import * as background from "./background";
import * as splash from "./splash";
// import * as modal from "./modal";

const log = log4js.getLogger("window-man");


// TODO: Separate all functions possible from class (all events from windows should come from ipc (?))
// TODO: Maybe events should come from a single EventEmitter class, which is the default export?
// TODO: Separate background into separate file
/**
 * Manages storage and creation of windows.
 * BrowserWindows should only be stored here.
 */
class WindowManager extends EventEmitter {
  /**
  * Preinitialization stage for windowManager
  * @param {integer} logPort The logging port to pass to new windows
  * @emits WindowManager#preinitialized
  */
  async preinit(logPort) {
    log.info("Start window-manager preinitialization.");
    this._configManager = Config.getManager("main");
    this._registerListeners();

    WindowStore.logPort = logPort;

    await splash.create();
  }

  /**
   * Starts the program background process
   * @emits WindowManager#initialized
   */
  async init() {
    log.info("Running startup procedure");
    /*
    Called after updater is finished
    Report background load progress to splash
    Once background is loaded, open a main window as hidden
    Once main window reports ready, show it and close the splash
    App is now ready to use
    */
  }


  // Utility

  /**
   * Registers default listeners
   * @private
   */
  _registerListeners() {
    // Swap to a different window (Ideally should not be used or even useful. Better to create a modal. Therefore considered deprecated!)
    ipcMain.on("changeWindow", (event) => {
      this.createMain();
      this.closeWindow(BrowserWindow.fromWebContents(event.sender));
    });

    // Modify window properties
    ipcMain.on("updateWindow", (event, arg) => {
      this.updateWindow(BrowserWindow.fromWebContents(event.sender), arg);
    });
  }
}

export default new WindowManager();

/**
 * An object containing a set of windows
 * @typedef windowSet
 * @memberof WindowManager
 * @type {object}
 * @property {external:electron#BrowserWindow} startsplash The start splash if it exists
 * @property {BrowserWindow} background The background window if it exists
 * @property {BrowserWindow[]} main An array of main windows
 * @property {BrowserWindow[]} modal An array of modal windows (Note that modals don't use the os modal type)
 */
