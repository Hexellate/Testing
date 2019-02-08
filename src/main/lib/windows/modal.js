// import log4js from "log4js";
import { createWindow, updateWindow } from "./windowLib";
import WindowStore from "./windowStore";

// const log = log4js.getLogger("window-man");

// TODO: Properly document modal options
/**
   * Creates a modal with the specified options
   * @param {object} modalOptions A set of parameters to be used for the modal
   */
async function create({ content = "ndef", owner = null, disable = "owner" }) {
  // TODO: Properly flesh out modals and ownership etc...
  const win = await createWindow({
    "type": "modal", "show": false, "content": content, "owner": owner, "disable": disable,
  });
  WindowStore.modal.push(win);

  if (global.isDev) {
    win.webContents.openDevTools();
  }
  win.setTitle("");

  win.on("closed", () => {
    WindowStore.modal.splice(WindowStore.modal.indexOf(win), 1);
    if (win.disable === "owner") {
      updateWindow(win, { "action": "setEnabled", "enabled": true });
    } else if (win.disable === "all") {
      for (const m in WindowStore.main) {
        updateWindow(m, { "action": "setEnabled", "enabled": true });
      }
    }
  });

  /* eslint-disable-next-line */
    const promise = await new Promise((resolve) => {
    win.once("ready-to-show", () => {
      win.show();
      resolve();
    });
    win.start();
  });
}

export { create };
