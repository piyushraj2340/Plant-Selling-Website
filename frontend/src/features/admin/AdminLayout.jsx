import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SideMenu from './Components/SideMenu';
import './admin.scss';

const AdminLayout = () => {
    const [openSlider, setOpenSlider] = useState(window.innerWidth >= 768);
    const location = useLocation();

    // Close on navigation for smaller screens
    useEffect(() => {
        if (window.innerWidth < 768) {
            setOpenSlider(false);
        }
    }, [location.pathname]);

    return (
        <div className="admin-panel d-flex m-0 vh-100 position-relative">
            {/* Overlay for mobile when sidebar is open */}
            {openSlider && window.innerWidth < 768 && (
                <div 
                    className="position-absolute top-0 start-0 w-100 h-100 bg-dark" 
                    style={{ opacity: 0.5, zIndex: 9 }}
                    onClick={() => setOpenSlider(false)}
                ></div>
            )}

            <div 
                className={`${openSlider ? 'slider-open' : 'slider-close'} side-nav-drag admin-sidebar py-3 px-2 px-md-3`} 
                style={{ 
                    overflowY: 'auto', 
                    maxHeight: "100vh", 
                    width: openSlider ? '250px' : '80px', 
                    minWidth: openSlider ? '250px' : '80px',
                    transition: 'width 0.3s, min-width 0.3s',
                    zIndex: 10
                }}
            >
                <SideMenu openSlider={openSlider} setOpenSlider={setOpenSlider} />
            </div>
            
            <div className="flex-grow-1 ps-sm-2 py-3 px-md-3 px-xl-5 admin-main-content w-100" style={{ overflowY: 'auto', maxHeight: "100vh" }}>
                <nav className="navbar p-0 mb-4" >
                    <div className="msg d-flex align-items-center">
                        <button className="navbar-toggler me-3" type="button" onClick={() => { setOpenSlider(!openSlider) }}>
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
