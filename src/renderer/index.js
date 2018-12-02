// import * as path from "path";
import React from "react";
import "react-devtools";
import ReactDOM from "react-dom";

import "./index.scss";
import App from "./app";
import Updater from "./updater";
import ErrorBoundary from "./components/appErrorBoundary";

const { windowType } = require("electron").remote.getCurrentWindow();

function WindowType() {
  if (windowType === "updater") {
    return <Updater />;
  }
  return <App />;
}

// Render either main app or updater
function render() {
  console.log(windowType);
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
