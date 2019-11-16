import { ipcRenderer } from "electron";
import React, { Component } from "react";
// import styled from "styled-components";
// import logo from "./logo.svg";


export default class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "status": {
        "mode": "text",
        "text": "starting",
        "indicator": {
          "form": "bar",
          "determined": false,
          "completed": NaN,
          "total": NaN,
          "suffix": "",
        },

      },
    };

    this.onSplashUpd = this.onSplashUpd.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on("splashStatus", this.onSplashUpd);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener("splashStatus", this.onSplashUpd);
  }

  onSplashUpd(event, arg) {
    this.setState({ "status": arg });
  }

  renderStatus() { // This is messy and not good and nice and needs to be cleaned up... But it works for testing...
    const { status } = this.state;
    const { suffix } = status.indicator;
    // const suffix = status.indicator.suffix;
    switch (status.mode) {
      case ("text"):
        return <p>current status: {status.text}</p>;
      case ("progressIndicator"):
        return <p>Insert {status.indicator.form} loading animation here{status.indicator.determined ? `: ${status.indicator.completed}${suffix}/${status.indicator.total}${suffix}` : "."}</p>;
      default:
        return <p>current status: None given</p>;
    }
  }

  render() {
    return (
      <div className="App">
        <p>This is the splash window. It will do stuff and look nice.</p>
        {this.renderStatus()}
      </div>
    );
  }
}
