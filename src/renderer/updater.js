import { ipcRenderer } from "electron";
import React, { Component } from "react";
import styled from "styled-components";
// import logo from "./logo.svg";

// TODO: Unsubscribe on unmount

const MessageBody = styled.div`
  height: calc(100vh - 27px);
  overflow-x: scroll;
  `;

const Pre = styled.pre`
  text-align: left;
  `;

export default class Updater extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "versionDetails": {}
      // "channelBox": ""
    };
    this.onRecVer = this.onRecVer.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on("getVer", this.onRecVer);

    ipcRenderer.on("updaterChangeStatus", this.getVersion);
    ipcRenderer.send("getVer");
  }

  componentWillUnmount() {
    ipcRenderer.removeListener("updaterChangeStatus", this.getVersion);
    ipcRenderer.removeListener("getVer", this.onRecVer);
  }

  onRecVer(event, arg) {
    this.setState({ "versionDetails": arg });
  }

  getVersion() {
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
        <MessageBody>
          <Pre>{JSON.stringify(this.state.versionDetails, null, 2)}</Pre>
        </MessageBody>
        <div id="buttonbar">
          <button type="button" onClick={this.goToApp}>
            Go To App
          </button>
          <button type="button" onClick={() => this.checkUpdates()}>
            Check For Updates
          </button>
          <button type="button" onClick={() => this.startUpdates()}>
            Get Updates
          </button>
        </div>
      </div>
    );
  }
}
