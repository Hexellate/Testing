import { BrowserWindow, app, ipcMain } from "electron";
import url from "url";
import * as Path from "path";
import log4js from "log4js";

const log = log4js.getLogger("window-man");

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
export default class windowManager {
  /**
   * @param {boolean} isDev Whether the environment is dev or production
   * @param {require("./config-manager").configManager} configMan The application config manager
   */
  constructor(isDev, configMan) {
    this._isDev = isDev;
    this._configManager = configMan;
    this._windows = {
      "startsplash": null,
      "background": null,
      "main": [],
      "modal": [],
    };
    this._bgStarted = false;
    this._registerListeners();
  }

  // Getters and setters
  /**
   * @return {windowSet} The windowSet of the windowManager instance
   */
  get windows() {
    return this._windows;
  }

  /**
   * Registers the ipc listeners for windowManager functions. Should only be called once
   */


  /**
   * Starts the program background process, which reports load progress to the splash
   */
  start() {
    /*
    Updater will already be checking
    Open splash
    Splash will show update progress etc...
    When there are no updates available, open background process
    Report background load progress to splash
    Once background is loaded, open a main window as hidden
    Once main window reports ready, show it and close the splash
    App is now ready to use
    */
  }

  /**
   * Creates a new main window process
   * @return {boolean} Returns true if succeeded, or false if failed
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

  /**
   * @private
   * Creates the background process
   */
  _createBackground() {
    const win = this._createWindow({ "type": "background", "show": false });
    this._windows.background = win;
    win.setTitle("background process");

    // TODO: Add tray icon and stuff

    win.on("closed", () => {
      this.windows.background = null; // Dereference windows on close to enable deletion
      // TODO: Send shutdown message to main
    });
  }

  createModal({ content = "ndef", owner = null, disable = "owner" }) {
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
   * Closes a browserwindow
   * @param {BrowserWindow} win The window to be closed
   */
  closeWindow(win) {
    win.close();
    // TODO: Extra handling for some window types?
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

  /**
   *
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
        log.error("ERROR: The referenced action has not yet been implemented.");
        break;
      case "default":
      default:
        log.error("ERROR: attempting to call update window with unrecognized action");
        break;
    }
    win.send("");
  }


  /**
   * @private
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
    const win = new BrowserWindow({
      width, height, transparent, show,
    });
    win.windowType = type;
    win.content = content;
    win.owner = owner;
    win.disable = disable;

    win.start = () => {
      if (this._isDev) {
        win.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
      } else {
        win.loadURL(
          url.format({
            "pathname": Path.join(__dirname, `index.html`),
            "protocol": "file",
            "slashes": true,
          })
        );
      }
      return win;
    };
  }

  _registerListeners() {
    ipcMain.on("changeWindow", (event) => {
      this.createMain();
      this.closeWindow(BrowserWindow.fromWebContents(event.sender));
    });

    ipcMain.on("updateWindow", (event, arg) => {
      this.updateWindow(BrowserWindow.fromWebContents(event.sender), arg);
    });
  }
}
