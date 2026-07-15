import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function SideMenu({ openSlider, setOpenSlider }) {
    const location = useLocation();
    const path = location.pathname;

    const navItems = [
        { path: '/dashboard', icon: 'fa-dashcube', label: 'Dashboard' },
        { path: '/dashboard/products', icon: 'fa-box-open', label: 'Products' },
        { path: '/dashboard/orders', icon: 'fa-clipboard', label: 'Orders' },
        { path: '/dashboard/review', icon: 'fa-star-half-alt', label: 'Reviews' },
        { path: '/dashboard/income', icon: 'fa-wallet', label: 'Income' },
        { path: '/dashboard/coupon', icon: 'fa-percentage', label: 'Coupons' },
        { path: '/dashboard/help', icon: 'fa-question-circle', label: 'Help' },
        { path: '/dashboard/users', icon: 'fa-users', label: 'Users' }
    ];

    return (
        <div className='vh-100 d-flex flex-column'>
            <div className="nav-header d-flex justify-content-between align-content-center px-2 py-1 py-md-3">
                <h5 className="h5 py-2 py-md-0 m-0"><i className="fa fa-connectdevelop"></i> {openSlider || window.innerWidth > 992 ? 'Dashboard' : ''}</h5>
                <div className="close-btn d-lg-none">
                    <button className='px-3 py-2 rounded bg-dark text-light border-0' onClick={() => { setOpenSlider(!openSlider) }}><i className="fas fa-close"></i></button>
                </div>
            </div>
            <div className="nav-body small d-flex flex-column justify-content-between flex-grow-1 mt-4">
                <div className="nav-items">
                    {navItems.map((item) => {
                        const isActive = path === item.path || (item.path === '/admin' && path === '/admin/');
                        return (
                            <div className="nav-item m-2" key={item.path}>
                                <Link to={item.path} className='text-decoration-none hover-side-nav-link'>
                                    <div className={`nav-link py-2 rounded px-3 ${isActive ? 'bg-white text-black fw-bold active-drop-shadow' : 'bg-transparent text-white fw-lighter'}`}>
                                        <i className={`fas ${item.icon} text-center`} style={{ width: '20px' }}></i>
                                        {(openSlider || window.innerWidth > 992) && <span className="item ms-2">{item.label}</span>}
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>
                <div className="nav-items mb-3">
                    <div className="nav-item m-2">
                        <Link to={'/profile'} className='text-decoration-none hover-side-nav-link'>
                            <div className={`nav-link py-2 rounded px-3 text-white`}>
                                <i className="fas fa-user-circle text-center" style={{ width: '20px' }}></i>
                                {(openSlider || window.innerWidth > 992) && <span className="item ms-2">User Profile</span>}
                            </div>
                        </Link>
                    </div>
                </div>
            </div >
        </div >
    )
}

export default SideMenu;