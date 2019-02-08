import log4js from "log4js";
import { createWindow } from "./windowLib";
import WindowStore from "./windowStore";

const log = log4js.getLogger("window-man");

/**
   * Create splash window for startup
   * @private
   */
async function create() {
  const win = await createWindow({ "type": "splash", "show": false });
  WindowStore.splash = win;
  // win.webContents.openDevTools();

  win.on("closed", () => {
    WindowStore.splash = null; // Dereference windows on close to enable deletion
  });

  // Wait for window ready-to-show event before resolving createSplash promise
  /* eslint-disable-next-line */
    const promise = await new Promise((resolve) => {
    win.once("ready-to-show", () => {
      win.setTitle("splash window");
      win.show();
      resolve();
    });
    win.start();
  });
}

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
function updateStatus({
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
  WindowStore.splash.send("splashStatus", {
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

export { create, updateStatus };
