import React from 'react'
import { Link } from 'react-router-dom'

const NurserySideNav = ({ isCollapseSideNav, setIsCollapseSideNav }) => {

    return (
        <div className="bg-white p-0 rounded d-none d-lg-block position-relative nursery-side-nav" style={isCollapseSideNav ? { width: '58px' } : { width: '25%' }}>
            <div className="mb-4 mb-lg-0">
                <div className="p-0">
                    <div className="">
                        <Link to={"/nursery/plants"}>
                            <div className="d-flex justify-content-between align-items-center p-3 border-bottom" style={{ height: "57px" }} data-toggle="tooltip" data-bs-placement="right" title='Manage Your Plants'>
                                <i className="text-warning material-symbols-outlined">forest</i>
                                <p className={`m-0 text-nowrap overflow-hidden ${isCollapseSideNav && 'd-none'}`}>Manage Your Plants</p>
                            </div>
                        </Link>
                        <Link to={"/nursery/order/track"}>
                            <div className="d-flex justify-content-between align-items-center p-3 border-bottom" style={{ height: "57px" }} data-toggle="tooltip" data-bs-placement="right" title='Track Your Shipment'>
                                <i className="fas fa-truck fa-lg text-warning"></i>
                                <p className={`m-0 text-nowrap overflow-hidden ${isCollapseSideNav && 'd-none'}`}>Track Your Shipment</p>
                            </div>
                        </Link>
                        <Link to={"/nursery/order"}>
                            <div className="d-flex justify-content-between align-items-center p-3 border-bottom" style={{ height: "57px" }} data-toggle="tooltip" data-bs-placement="right" title='Manage Your Orders'>
                                <i className="fas fa-history fa-lg text-warning"></i>
                                <p className={`m-0 text-nowrap overflow-hidden ${isCollapseSideNav && 'd-none'}`}>Manage Your Orders</p>
                            </div>
                        </Link>
                        <Link to={"/nursery/plant/new"}>
                            <div className="d-flex justify-content-between align-items-center p-3 border-bottom" style={{ height: "57px" }} data-toggle="tooltip" data-bs-placement="right" title='Add Selling Plants'>
                                <i className="fas fa-tree fa-lg text-warning"></i>
                                <p className={`m-0 text-nowrap overflow-hidden ${isCollapseSideNav && 'd-none'}`}>Add Selling Plants</p>
                            </div>
                        </Link>
                        <Link to={"/nursery/settings"}>
                            <div className="d-flex justify-content-between align-items-center p-3 border-bottom" style={{ height: "57px" }} data-toggle="tooltip" data-bs-placement="right" title='Settings'>
                                <i className="fa fa-gear fa-lg text-warning"></i>
                                <p className={`m-0 text-nowrap overflow-hidden ${isCollapseSideNav && 'd-none'}`}>Settings</p>
                            </div>
                        </Link>
                        <Link to={"/logout"}>
                            <div className="d-flex justify-content-between align-items-center p-3 border-bottom" style={{ height: "57px" }} data-toggle="tooltip" data-bs-placement="right" title='Logout'>
                                <i className="fa fa-sign-out text-warning"></i>
                                <p className={`m-0 text-nowrap overflow-hidden ${isCollapseSideNav && 'd-none'}`}>Logout</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
            <div className={`nursery-collapse-side p-1 open ${!isCollapseSideNav && 'd-none'}`} data-toggle="tooltip" data-bs-placement="right" title='Open Slider' onClick={() => setIsCollapseSideNav(!isCollapseSideNav)}>
                <div className="bar bar1"></div>
                <div className="bar bar2"></div>
            </div>
            <div className={`nursery-collapse-side p-1 close ${isCollapseSideNav && 'd-none'}`} data-toggle="tooltip" data-bs-placement="right" title='Close Slider' onClick={() => setIsCollapseSideNav(!isCollapseSideNav)}>
                <div className="bar bar1"></div>
                <div className="bar bar2"></div>
            </div>
        </div>
    )
}

export default NurserySideNav