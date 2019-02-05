// The entry point of the application, should be the only part of the main script that is modified in a project. Also should be ignored in jsdocs (?)

import application from "./application";

const opts = {
  "devName": "Auto Update Test - dev",
};

application.start(opts);
