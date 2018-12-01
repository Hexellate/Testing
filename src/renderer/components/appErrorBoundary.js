import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

// This will be the "entire app has crashed" screen
// TODO: Properly construct this page with responsive design and useful information on the error.

const PageWrap = styled.div`
  background-Color: #1f6cf9;
  height: 100vh;
  `;

const HeadText = styled.h1`
  margin: 0px;
  text-align: center;
  line-height: 100vh;
  color: #ffffff;
  `;

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { "hasError": false };
  }


  static getDerivedStateFromError() {
    return { "hasError": true };
  }

  componentDidCatch(error, info) {
    console.error(`${error}: ${info}`);
  }

  render() {
    if (this.state.hasError) {
      return (
        <PageWrap>
          <HeadText>
            Something has gone seriously wrong :(
          </HeadText>
        </PageWrap>
      );
    }


    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  "children": PropTypes.element.isRequired
};

export default ErrorBoundary;
