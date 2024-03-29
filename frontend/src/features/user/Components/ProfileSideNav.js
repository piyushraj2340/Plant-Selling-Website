import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const ProfileSideNav = () => {
    const user = useSelector(state => state.user.user);

    return (
        <div className="card mb-4 mb-lg-0">
            <div className="card-body p-0">
                <ul className="list-group list-group-flush rounded-3">
                    <Link to={"/orders-history"}>
                        <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                            <i className="fas fa-history fa-lg text-warning"></i>
                            <p className="mb-0">Orders History</p>
                        </li>
                    </Link>
                    <Link to="/orders/history">
                        <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                            <i className="fas fa-truck fa-lg text-warning"></i>
                            <p className="mb-0">Track Your Orders</p>
                        </li>
                    </Link>
                    <Link to={"/address"}>
                        <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                            <i className="fas fa-address-card fa-lg text-warning"></i>
                            <p className="mb-0">Manage Your Address</p>
                        </li>
                    </Link>
                    <Link to={user.role.includes("seller") ? "/nursery" : "/nursery/create"}>
                        <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                            <i className="fas fa-tree fa-lg text-warning"></i>
                            <p className="mb-0">{user.role.includes("seller") ? "Manage Your Nursery" : "Add Your Nursery"}</p>
                        </li>
                    </Link>
                    <Link to={"/settings"}>
                        <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                            <i className="fa fa-gear fa-lg text-warning"></i>
                            <p className="mb-0">Settings</p>
                        </li>
                    </Link>
                    <Link to={"/logout"}>
                        <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                            <i className="fa fa-sign-out text-warning"></i>
                            <p className="mb-0">Logout</p>
                        </li>
                    </Link>
                </ul>
            </div>
        </div>
    )
}

export default ProfileSideNav