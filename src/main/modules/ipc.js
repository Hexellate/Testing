// import { BrowserWindow } from "electron";
// import { ipcMain } from "electron";
import _ from "lodash";

/**
 * @typedef broadcastParam
 * @type {object}
 * @property {string} channel The channel to broadcast on
 * @property {object} [message] The message object to send over channel. Can be nothing
 * @property {string} [message.title] The title of the message
 * @property {object} message.body The contents of the message
 * @property {string[]} [targets] The recipients of the broadcast
 * @property {import("./window-manager").windowSet} windows The set of windows to broadcast to
 */

/**
 * @param {broadcastParam} params Contains input parameters
 */
// eslint-disable-next-line import/prefer-default-export
export const ipcBroadcast = ({
  channel = "broadcast", message = {}, windows, targets = ["main"],
}) => {
  _.map(targets, (val) => {
    switch (val.toLowerCase()) {
      case "splash":
      case "startsplash":
        windows.startsplash.webContents.send(channel, message);
        break;
      case "background":
        windows.background.webContents.send(channel, message);
        break;
      case "main":
        _.map(windows.main, ref => ref.webContents.send(channel, message));
        break;
      default:
        _.flatMapDeep(windows, ref => ref.webContents.send(channel, message));
        break;
    }
  });
};
