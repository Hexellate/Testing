// import log4js from "log4js";
import { createWindow } from "./windowLib";
import WindowStore from "./windowStore";

/**
   * Creates the background process
   */
async function create() {
  // TODO: This should be reimplemented using a child process in order to achieve proper parallelism
  const win = await createWindow({ "type": "background", "show": false });
  WindowStore.background = win;
  win.setTitle("background process");

  // TODO: Add tray icon and stuff

  win.on("closed", () => {
    WindowStore.background = null; // Dereference windows on close to enable deletion
    // TODO: Send shutdown message to main
  });

  /* eslint-disable-next-line */
    const promise = await new Promise((resolve) => {
    win.once("ready-to-show", () => {
      resolve();
    });
    win.start();
  });
}

export { create };
