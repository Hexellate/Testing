import React from "react";
import styled from "styled-components";

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

function Background() {
  return (
    <PageWrap>
      <HeadText>
        <p>
          This is the background window... It should be hidden.
          {"(If you're wondering it runs certain background tasks)"}
        </p>
      </HeadText>
    </PageWrap>
  );
}

export default Background;

export function start() {
  // This is the background task
}
