import { BrowserWindow, app, ipcMain } from "electron";
import url from "url";
import * as Path from "path";

/*
Manages open windows

index.js will create a windowmanager class
*/

/**
 * Manages storage and creation of windows.
 * BrowserWindows should only be stored here.
 */
export default class windowManager {
  constructor(isDevelopment) {
    this._isDev = isDevelopment;
    this._windows = {
      "startsplash": null,
      "background": null,
      "main": [],
    };
    this._bgStarted = false;
    this._registerListeners();
  }

  // Getters and setters

  get windows() {
    return this._windows;
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
    const win = this._createWindow({ "type": "background", "show": false });
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

  /**
   * Closes a browserwindow
   * @param {BrowserWindow} win The window to be closed
   */
  closeWindow(win) {
    win.close();
    // TODO: Extra handling for some window types?
  }


  /**
   *
   * @param {BrowserWindow} win The window to update
   * @param {object} params Object containing parameters
   * @param {string} params.action Action to perform on given window
   * @param {number} params.width Used for setting window size
   * @param {number} params.height Used for setting window height
   * @param {boolean} params.resizable Used for setting if window is resizable
   * @param {string} params.title Used for setting window title
   */
  updateWindow(win, {
    action = "default", width = 800, height = 600, resizable = true, title = app.getName(),
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
      case "setEnabled":
        console.error("ERROR: attempting to call update window with unrecognized action");
        break;
      case "default":
      default:
        break;
    }
    win.send("");
  }


  /**
   * @private
   * Creates a window and returns it
   * @param {object}
   * @return {BrowserWindow} The window created
   */
  _createWindow({
    width = 800,
    height = 600,
    type = "main",
    transparent = false,
    show = false,
  } = {}) {
    const win = new BrowserWindow({
      width, height, transparent, show,
    });
    win.windowType = type;

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
  }
}
