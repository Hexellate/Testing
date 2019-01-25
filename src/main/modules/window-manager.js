import { BrowserWindow, app, ipcMain } from "electron";
import url from "url";
import * as Path from "path";
import log4js from "log4js";
import { EventEmitter } from "events";
import ConfigManager from "./config-manager";

const log = log4js.getLogger("window-man");

// const managers = {};

/**
 * @typedef windowSet
 * @type {object}
 * @property {BrowserWindow} startsplash
 * @property {BrowserWindow} background
 * @property {BrowserWindow[]} main
 * @property {BrowserWindow[]} modal
 */

/**
 * Manages storage and creation of windows.
 * BrowserWindows should only be stored here.
 */
class Manager extends EventEmitter {
  constructor() {
    super();

    this._windows = {
      "startsplash": null,
      "background": null,
      "main": [],
      "modal": [],
    };
    this._bgStarted = false;

    this._configManager = ConfigManager.getManager("main");
    this._registerListeners();
  }

  /**
  * Preinitialization stage for windowManager
  * @param {boolean} isDev Whether the environment is dev or production manager
  * @param {integer} logPort The logging port to pass to new windows
  * @emits Manager#preinitialized
  */
  async preinit(isDev, logPort) {
    log.info("Start window-manager preinitialization.");
    this._isDev = isDev;
    this._logPort = logPort;
    this._createSplash(() => {
      this.emit("preinitialized");
    });
  }

  /**
   * Starts the program background process
   * @emits Manager#initialized
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
    // this._createBackground(() => {
    this.emit("initialized");
    // });
  }

  // Creators

  /**
   * Create splash window for startup
   * @param {function} callback Function to call when splash has been shown
   */
  _createSplash(callback) {
    const win = this._createWindow({ "type": "splash", "show": false });
    this._windows.splash = win;
    // win.webContents.openDevTools();

    win.once("ready-to-show", () => {
      win.setTitle("splash window");
      win.show();
      callback();
    });

    win.on("closed", () => {
      this.windows.splash = null; // Dereference windows on close to enable deletion
    });
    win.start();
  }

  /**
   * Creates the background process
   */
  _createBackground(callback) {
    // TODO: This should be reimplemented using a child process in order to achieve proper parallelism
    const win = this._createWindow({ "type": "background", "show": false });
    this._windows.background = win;
    win.setTitle("background process");

    // TODO: Add tray icon and stuff

    win.once("ready-to-show", callback);

    win.on("closed", () => {
      this.windows.background = null; // Dereference windows on close to enable deletion
      // TODO: Send shutdown message to main
    });
  }

  /**
   * Creates a new main window process
   */
  createMain() {
    // TODO: Check if allowed to create main, if so, then create main
    const win = this._createWindow({ "type": "main", "show": false });
    this._windows.main.push(win);

    if (this._isDev) {
      win.webContents.openDevTools();
    }
    win.setTitle("");

    win.on("closed", () => {
      this.windows.main.splice(this.windows.main.indexOf(win), 1);
    });

    win.once("ready-to-show", () => {
      win.show(); // Need to do more complex loading for main window
    });
  }

  // TODO: Properly document modal options
  /**
   * Creates a modal with the specified options
   * @param {object} modalOptions A set of parameters to be used for the modal
   */
  createModal({ content = "ndef", owner = null, disable = "owner" }) {
    // TODO: Properly flesh out modals and ownership etc...
    const win = this._createWindow({
      "type": "modal", "show": false, "content": content, "owner": owner, "disable": disable,
    });
    this._windows.modal.push(win);

    if (this._isDev) {
      win.webContents.openDevTools();
    }
    win.setTitle("");

    win.once("ready-to-show", () => {
      win.show(); // Need to do more complex loading for main window
    });

    win.on("closed", () => {
      this.windows.modal.splice(this.windows.modal.indexOf(win), 1);
      if (win.disable === "owner") {
        this.updateWindow(win, { "action": "setEnabled", "enabled": true });
      } else if (win.disable === "all") {
        for (const m in this.windows.main) {
          this.updateWindow(m, { "action": "setEnabled", "enabled": true });
        }
      }
    });

    win.start();
  }

  /**
   * Creates a window and returns it
   * @param {object} windowParams
   * @param {number} windowParams.width The width
   * @param {number} windowParams.height The height
   * @param {string} windowParams.type The window type
   * @param {boolean} windowParams.transparent Whether the window is transparent
   * @param {boolean} windowParams.show Whether the window is hidden
   * @return {BrowserWindow} The window created
   */
  _createWindow({
    width = 800,
    height = 600,
    type = "main",
    content = "ndef",
    transparent = false,
    show = false,
    owner = null,
    disable = "none",
  }) {
    log.info(`Creating new window of type "${type}".`);
    const win = new BrowserWindow({
      width, height, transparent, show,
    });
    win.windowType = type;
    win.content = content;
    win.owner = owner;
    win.disable = disable;
    win.logPort = this._logPort;

    win.start = () => {
      log.info(`Starting window of type "${type}".`);
      if (this._isDev) {
        win.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
      } else {
        log.debug("Launching window in non-dev mode");
        log.debug(`Window load url: "${
          url.format({
            "pathname": Path.join(__dirname, `index.html`),
            "protocol": "file",
            "slashes": true,
          })}"`);
        win.loadURL(
          url.format({
            "pathname": Path.join(__dirname, `index.html`),
            "protocol": "file",
            "slashes": true,
          })
        );
      }
    };
    return win;
  }

  // Manipulators

  /**
   * Sends a status change to the splash window
   * @param {object} status - Object containing details sent to splash window
   * @param {string} status.mode - Display mode. Can be "text" or "progressIndicator"
   * @param {string} status.text - Text to be displayed alongside any progress indicator, or exclusively
   * @param {string} status.form - Used to indicate type of progress indicator. Can be "bar" or "wheel"
   * @param {boolean} status.determined - Used to indicate if progress amount is known.false
   * @param {number} status.completed - The number of progress units that have been completed
   * @param {number} status.total - The total number of progress units
   * @param {string} status.suffix - A suffix to be displayed after progress units
   */
  splashStatus({
    mode = "text",
    text = null,
    form = "bar",
    determined = false,
    completed = NaN,
    total = NaN,
    suffix = "",
  }) {
    log.info(`Sending message to splash: ${mode}, "${text}"${
      mode === "progressIndicator" ? ` ${
        determined ? `${completed}/${total}${suffix}` : ""
      }` : ""
    }`);
    this._windows.splash.send("splashStatus", {
      "mode": mode,
      "text": text,
      "indicator": {
        "form": form,
        "determined": determined,
        "completed": completed,
        "total": total,
        "suffix": suffix,
      },
    });
  }

  /**
   * @typedef windowUpdateParams
   * @type {object}
   * @property {string} action Action to perform on given window
   * @property {number} width Used for setting window size
   * @property {number} height Used for setting window height
   * @property {boolean} resizable Used for setting if window is resizable
   * @property {string} title Used for setting window title
   */

  // TODO: windowUpdateParams should not be in its own typedef
  /**
   * Changes a windows properties
   * @param {BrowserWindow} win The window to update
   * @param {windowUpdateParams} params Object containing parameters
   */
  updateWindow(win, {
    action = "default", width = 800, height = 600, resizable = true, title = app.getName(), enabled = true,
  }) {
    switch (action) {
      case "resize":
        win.setSize(width, height, true);
        win.center();
        break;
      case "resizable":
        win.setResizable(resizable);
        break;
      case "setTitle":
        win.setTitle(title);
        break;
      case "setEnabled":
        win.setEnabled(enabled);
        break;
      case "setMaxSize":
      case "setMinSize":
      case "setMovable":
      case "setMinimizable":
      case "setMaximizable":
      case "setFullScreenable":
      case "setClosable":
      case "setMaximize":
      case "setUnmaximize":
      case "setMinimize":
      case "setFullScreen":
      case "setAspectRatio":
        log.error("The referenced action has not yet been implemented.");
        break;
      case "default":
      default:
        log.error("Attempting to perform window update with unrecognized action");
        break;
    }
    win.send("");
  }

  /**
   * Closes a browserwindow
   * @param {BrowserWindow} win The window to be closed
   */
  closeWindow(win) {
    win.close();
    // TODO: Send close event to window rather than closing here, then window can close itself(?). This will need handling for frozen windows
  }

  // Utility
  /**
   * @return {windowSet} The windowSet of the windowManager instance
   */
  get windows() {
    return this._windows;
  }

  /**
   * Registers default listeners
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

// /**
//  * returns the specified update manager
//  * @param {string} type - The identifier for the update manager
//  * @returns {Manager}
//  */
// function getManager(type) {
//   if (type !== null) {
//     return managers[type];
//   }
//   return managers.main;
// }

// /**
//  * Creates a new update manager
//  * @param {boolean} isDev - Whether in a development environment
//  * @param {string} type - The identifier for the update manager
//  * @returns {Manager}
//  */
// function createManager(isDev, type, logPort) {
//   managers[type] = new Manager(isDev, type, logPort);
//   return managers[type];
// }

// export default {
//   "getManager": getManager,
//   "createManager": createManager,
// };

export default new Manager();
