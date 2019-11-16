import { BrowserWindow, app } from "electron";
import log4js from "log4js";
import url from "url";
import * as Path from "path";
import WindowStore from "./windowStore";

const log = log4js.getLogger("window-man");

/**
   * Creates a window and returns it
   * @private
   * @param {object} windowParams
   * @param {number} windowParams.width The width
   * @param {number} windowParams.height The height
   * @param {string} windowParams.type The window type can be "foreground", "background", "splash" or "modal"
   * @param {string} windowParams.content The content of the window. Only applicable to foreground and modal types
   * @param {boolean} windowParams.transparent Whether the window is transparent
   * @param {boolean} windowParams.show Whether the window is hidden
   * @return {BrowserWindow} The window created
   */
async function createWindow({
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
  win.logPort = WindowStore.logPort;

  win.start = () => {
    log.info(`Starting window of type "${type}".`);
    if (global.isDev) {
      win.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
    } else {
      log.debug("Launching window in non-dev mode");
      const link = url.format({
        "pathname": Path.join(__dirname, `index.html`),
        "protocol": "file",
        "slashes": true,
      });
      log.debug(`Window load url: "${link}"`);
      win.loadURL(link);
    }
  };
  return win;
}

/**
 * @typedef windowUpdateParams
 * @memberof WindowManager
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
   * @param {WindowManager.windowUpdateParams} params Object containing parameters
   */
function updateWindow(win, {
  action = "default",
  width = 800,
  height = 600,
  resizable = true,
  title = app.getName(),
  enabled = true,
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
function closeWindow(win) {
  win.close();
  // TODO: Send close event to window rather than closing here, then window can close itself(?). This will need handling for frozen windows
}

export { createWindow, updateWindow, closeWindow };
