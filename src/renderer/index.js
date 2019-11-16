// import * as path from "path";
import React from "react";
// import "react-devtools";
import ReactDOM from "react-dom";
import log4js from "log4js";

import "./index.scss";
import App from "./app";
import Updater from "./updater";
import Splash from "./splash";
import ErrorBoundary from "./components/appErrorBoundary";
import Background from "../background/index";

const { windowType, logPort } = require("electron").remote.getCurrentWindow();

console.log(`Logging on port ${logPort}`);
console.log(`Window of type "${windowType}"`);

log4js.configure({
  "appenders": {
    "mainRemote": { "type": "tcp", "host": "localhost", "port": logPort },
  },
  "categories": {
    "default": { "appenders": ["mainRemote"], "level": "all" },
  },
});

const log = log4js.getLogger("index");
log.info("It works!!!");

function WindowType() {
  switch (windowType) {
    case ("updater"):
      return <Updater />;
    case ("splash"):
      return <Splash />;
    case ("background"):
      return <Background />;
    default:
      return <App />;
  }
}

// Render either main app or updater
function render() {
  ReactDOM.render(
    <ErrorBoundary>
      <WindowType />
    </ErrorBoundary>, document.getElementById("app")
  );
}
render();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
