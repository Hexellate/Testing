import { app, BrowserWindow } from "electron";
import * as path from "path";
import url from "url";

const isDevelopment = process.env.NODE_ENV !== "production";

// Keep a global reference of the window object, if you don't, the window will be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 800, height: 600 });

  // and load the index.html of the app.
  if (isDevelopment) {
    mainWindow.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file",
      slashes: true
    }));
  }


  // Open the DevTools.
  if (isDevelopment) {
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.webContents.openDevTools();
  }


  // Emitted when the window is closed.
  mainWindow.on("closed", function() {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function() {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  if (mainWindow === null) {
    createWindow();
  }
});
