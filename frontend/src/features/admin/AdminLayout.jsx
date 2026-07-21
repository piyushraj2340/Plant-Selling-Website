import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SideMenu from './Components/SideMenu';
import './admin.scss';

const AdminLayout = () => {
    const [openSlider, setOpenSlider] = useState(false);

    return (
        <div className="admin-panel row m-0 vh-100">
            <div className={`${openSlider ? 'slider-open' : 'slider-close'} col-md-8 d-lg-block col-lg-2 col-xl-2 side-nav-drag bg-dark text-light py-3 px-md-3 px-lg-2 px-xl-3`}>
                <SideMenu openSlider={openSlider} setOpenSlider={setOpenSlider} />
            </div>
            <div className="col-12 col-lg-10 col-xl-10 ps-sm-2 py-3 px-md-3 px-xl-5" style={{ backgroundColor: "antiquewhite", overflowY: 'auto', maxHeight: "100vh" }}>
                <nav className="navbar p-0 mb-4" >
                    <div className="msg d-flex align-items-center">
                        <button className="d-lg-none navbar-toggler" type="button" onClick={() => { setOpenSlider(!openSlider) }}>
                            <span className="navbar-toggler-icon">☰</span>
                        </button>
                        <div className="login-message py-3 ms-4 ms-lg-0">
                            <h3 className="h4 m-0"> Admin Dashboard <i>👋</i></h3>
                        </div>
                    </div>
                </nav>
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
