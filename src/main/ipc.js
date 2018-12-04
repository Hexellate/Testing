// import { BrowserWindow } from "electron";
// import { ipcMain } from "electron";


/*
  Change to ipc, with broadcast functions and backgroundManager
  All ipc should be in the relevant module, i.e. autoupdate stuff in updatemaanger, window stuff in windowmanager etc...
*/

/**
 *
 * @param {object} obj Contains input parameters
 * @param {string} obj.channel The channel to broadcast on
 * @param {object} obj.message The message object to send over channel
 * @param {BrowserWindow[]} obj.windows The set of windows to broadcast to
 */
// eslint-disable-next-line import/prefer-default-export
export const ipcBroadcast = ({ channel = "broadcast", message = {}, windows } = {}) => {
  // TODO: Needs another input for recipient (i.e. don't broadcast to background window and splash when only targeting main)
  windows.map(ref => ref.webContents.send(channel, message));
};
