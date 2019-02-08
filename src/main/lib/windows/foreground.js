// import log4js from "log4js";
import { createWindow } from "./windowLib";
import WindowStore from "./windowStore";

/**
   * Creates a new main window process
   */
async function create() {
  // TODO: Check if allowed to create main, if so, then create main
  const win = await createWindow({ "type": "foreground", "show": false });
  WindowStore.main.push(win);

  if (global.isDev) {
    win.webContents.openDevTools();
  }
  win.setTitle("");

  win.on("closed", () => {
    WindowStore.foreground.splice(WindowStore.foreground.indexOf(win), 1);
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
