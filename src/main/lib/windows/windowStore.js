/**
 * @file Stores open windows
 */


class WindowStore {
  constructor() {
    this.modals = [];
    this.foreground = [];
    this.splash = null;
    this.background = null;
    this.logPort = 1234567;
  }
}

export default new WindowStore();
