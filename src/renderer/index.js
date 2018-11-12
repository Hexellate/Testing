// import * as path from "path";
import React from "react";
import "react-devtools";
import ReactDOM from "react-dom";
// import { BrowserRouter, Route, Switch } from "react-router-dom";

import "./index.scss";
import App from "./app";
import Updater from "./updater";

const { windowType } = require("electron").remote.getCurrentWindow();

// Render either main app or updater
function render() {
  console.log(windowType);
  if (windowType === "updater") {
    ReactDOM.render(<Updater />, document.getElementById("app"));
  } else {
    ReactDOM.render(<App />, document.getElementById("app"));
  }
  // ReactDOM.render(
  //   {if (windowType === "updater") {
  //     <App/>
  //   } else {
  //     <Updater />
  //   }},
  //   // <BrowserRouter>
  //   //   <Switch>
  //   //     {console.log(windowType)}
  //   //     <Route path="/" component={App} />
  //   //     <Route path="/updater/" component={Updater} />
  //   //   </Switch>
  //   // </BrowserRouter>,
  //   document.getElementById("app")
  // );
}
render();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
