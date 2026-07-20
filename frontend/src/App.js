import React from "react";
import { ConfigProvider, message } from "antd";

// importing form styling[sass]
import "./Asset/Style/Style.scss"

import useScrollToTop from "./hooks/useScrollToTop";
import Routing from "./Routing/Routing";


function App() {
  useScrollToTop();

  // global configuration antd to alert the message to users
  message.config({
    top: 75,
    maxCount: 3,
    CSSProperties: {
      backgroundColor: "#000",
      color: "#fff"
    }
  });

  return (
    <ConfigProvider
      button={{
        style: {
          width: 80,
          margin: 4,
        },
      }}
    >
      <Routing />
    </ConfigProvider>
  );
}

export default React.memo(App);
