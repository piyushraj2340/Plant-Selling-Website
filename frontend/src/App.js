import React from "react";
import { ConfigProvider, message } from "antd";

// importing form styling[sass]
import "./Asset/Style/Style.scss"

import Navigation from "./features/common/Navigation";
import Footer from "./features/common/Footer";
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
    <>
      <Navigation  />
      <div style={{ marginTop: "70px", minHeight: "calc(70vh)" }}>
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
      </div>
      <Footer />
    </>

  );
}

export default React.memo(App);
