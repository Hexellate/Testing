/**
 * @file Manages exports from updater module
 */
import { start } from "./updater";
import Store from "./dataStore";

export default {
  "preinit": start,
  "Provider": Store.Provider,
};
