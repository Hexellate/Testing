import * as path from "path";
import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
//import * as serviceWorker from "./serviceWorker";

function render() {
    const App = require('./App').default;
    ReactDOM.render(<App />, document.getElementById("app"));
}
if (module.hot) {
    module.hot.accept('./App', render);
}
render();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
//serviceWorker.unregister();
