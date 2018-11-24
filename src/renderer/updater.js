import { ipcRenderer } from "electron";
import React, { Component } from "react";
// import logo from "./logo.svg";
import "./app.scss";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "versionDetails": {}
      // "channelBox": ""
    };

    ipcRenderer.on("getVer", (event, arg) => {
      this.setState({ "versionDetails": arg });
    });

    ipcRenderer.on("updaterChangeStatus", () => {
      ipcRenderer.send("getVer");
    });
  }

  componentDidMount() {
    ipcRenderer.send("getVer");
  }

  // setChannel() {
  //   // console.log(this.state);
  //   ipcRenderer.send("setChannel", this.state.channelBox);
  // }

  handleInputChange(event) {
    const { target } = event;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const { name } = target;

    this.setState({
      [name]: value
    });
  }

  checkUpdates() {
    ipcRenderer.send("getUpd");
  }

  startUpdates() {
    ipcRenderer.send("dlUpd");
  }

  goToApp() {
    ipcRenderer.send("changeWindow", { "type": "main" });
  }

  render() {
    return (
      <div className="App">
        <div>
          <pre>{JSON.stringify(this.state.versionDetails, null, 2)}</pre>
        </div>
        <button type="button" onClick={this.goToApp}>
          Go To App
        </button>
        {/* <input
          type="text"
          name="channelBox"
          value={this.state.channelBox}
          onChange={evt => this.handleInputChange(evt)}
        />
        <button type="button" onClick={() => this.setChannel()}>
          Set Channel
        </button> */}
        <button type="button" onClick={() => this.checkUpdates()}>
          Check For Updates
        </button>
        <button type="button" onClick={() => this.startUpdates()}>
          Get Updates
        </button>
      </div>
    );
  }
}
