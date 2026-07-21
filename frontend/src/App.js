import React, { useEffect, useState } from "react";
import { ConfigProvider, message, Button } from "antd";

// importing form styling[sass]
import "./Asset/Style/Style.scss"

import useScrollToTop from "./hooks/useScrollToTop";
import Routing from "./Routing/Routing";
import localStorageUtil from "./utils/localStorage";

function App() {
  useScrollToTop();
  const [isImpersonating, setIsImpersonating] = useState(false);

  useEffect(() => {
    if (localStorageUtil.getData("adminAccessToken")) {
      setIsImpersonating(true);
    }
  }, []);

  const handleStopImpersonating = () => {
    const adminAccessToken = localStorageUtil.getData("adminAccessToken");
    const adminRefreshToken = localStorageUtil.getData("adminRefreshToken");
    if (adminAccessToken && adminRefreshToken) {
      localStorageUtil.setData("accessToken", adminAccessToken);
      localStorageUtil.setData("refreshToken", adminRefreshToken);
      localStorageUtil.removeData("adminAccessToken");
      localStorageUtil.removeData("adminRefreshToken");
      window.location.href = '/dashboard/users';
    }
  };

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
      {isImpersonating && (
        <>
          <style>{`
            .fixed-top { top: 40px !important; }
            body { padding-top: 40px !important; }
          `}</style>
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '40px', zIndex: 9999, backgroundColor: '#ff4d4f', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', fontSize: '14px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <span style={{ margin: 0, fontWeight: 'bold' }}>Impersonating User</span>
            <Button size="small" type="default" onClick={handleStopImpersonating} style={{ padding: '0 10px', height: '24px', lineHeight: '22px' }}>Stop</Button>
          </div>
        </>
      )}
      <Routing />
    </ConfigProvider>
  );
}

export default React.memo(App);
