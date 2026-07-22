import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';

const MainLayout = () => {
  return (
    <>
      <Navigation />
      <div style={{ marginTop: '70px', minHeight: 'calc(70vh)' }}>
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default MainLayout;
