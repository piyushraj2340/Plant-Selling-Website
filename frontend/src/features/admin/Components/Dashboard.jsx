import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { message } from 'antd';
import DashboardBarGraph from "./DashboardBarGraph";
import DashboardDoughnutGraph from "./DashboardDoughnutGraph";
import RecentOrder from './RecentOrder';


const Dashboard = () => {
    const token = useSelector(state => state.user.token);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalNurseries: 0,
        totalPlants: 0,
        totalOrders: 0,
        totalRevenue: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/v2/admin/stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setStats(data.stats);
                } else {
                    message.error(data.message || 'Failed to fetch stats');
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, [token]);

    return (
        <>
            <header className="row g-2">
                <div className="col-md-6 col-xl-3 rounded">
                    <div className="d-flex bg-light align-items-center border p-2">
                        <div className="icon rounded-circle border d-flex justify-content-center align-items-center" style={{ fontSize: "2.5rem", backgroundColor: "#fd9bdb", color: "#c60056", width: "6rem", height: "6rem" }}>
                            <i className="fas fa-users"></i>
                        </div>
                        <div className="icon-content text-dark ps-3 pe-1 d-flex flex-column justify-content-center">
                            <small className="small fw-lighter" style={{ fontSize: "14px" }}>Total Users</small>
                            <b className="fw-bold">{stats.totalUsers}</b>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-xl-3 rounded">
                    <div className="d-flex bg-light align-items-center border p-2">
                        <div className="icon rounded-circle border d-flex justify-content-center align-items-center" style={{ fontSize: "3rem", backgroundColor: "#a8f3a8", width: "6rem", height: "6rem" }}>
                            <i className="fas fa-seedling" style={{ color: "rgb(3, 122, 3)" }}></i>
                        </div>
                        <div className="icon-content text-dark ps-3 pe-1 d-flex flex-column justify-content-center">
                            <small className="small fw-lighter" style={{ fontSize: "14px" }}>Total Nurseries</small>
                            <b className="fw-bold">{stats.totalNurseries}</b>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-xl-3 rounded">
                    <div className="d-flex bg-light align-items-center border p-2">
                        <div className="icon rounded-circle border d-flex justify-content-center align-items-center" style={{ fontSize: "3rem", backgroundColor: "#ddabf5", color: "#8700c6", width: "6rem", height: "6rem" }}>
                            <i className="fa fa-clipboard"></i>
                        </div>
                        <div className="icon-content text-dark ps-3 pe-1 d-flex flex-column justify-content-center">
                            <small className="small fw-lighter" style={{ fontSize: "14px" }}>Orders</small>
                            <b className="fw-bold">{stats.totalOrders}</b>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-xl-3 rounded">
                    <div className="d-flex bg-light align-items-center border p-2">
                        <div className="icon rounded-circle border d-flex justify-content-center align-items-center" style={{ fontSize: "3rem", backgroundColor: "#7ce9f9", color: "#026c7c", width: "6rem", height: "6rem" }}>
                            <i className="fas fa-wallet"></i>
                        </div>
                        <div className="icon-content text-dark ps-3 pe-1 d-flex flex-column justify-content-center">
                            <small className="small fw-lighter" style={{ fontSize: "14px" }}>Revenue</small>
                            <b className="fw-bold">₹{stats.totalRevenue.toLocaleString()}</b>
                        </div>
                    </div>
                </div>
            </header>
            <div className="row d-flex g-2 my-2">
                <div className="bar-graph col-12 col-lg-8">
                    <div className="bg-light h-100 rounded border px-3 py-2 px-md-4 d-flex flex-column align-items-center">
                        <div className="graph-header w-100 d-flex justify-content-between align-content-center py-3" >
                            <div className="left d-flex flex-column">
                                <h5 className="h4 fw-bold">Overview</h5>
                                <small className="small fw-light text-secondary" style={{ fontSize: "12px" }}>Overview for the store.</small>
                            </div>
                            <div className="right">
                                <select name="filterIncome" id="filterIncome" defaultValue="Quarterly" className="form-select" style={{ fontSize: "12px" }}>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Quarterly">Quarterly</option>
                                    <option value="Yearly">Yearly</option>
                                </select>
                            </div>
                        </div>
                        <DashboardBarGraph />
                    </div>
                </div>

                <div className="bar-graph col-12 col-lg-4">
                    <div className="bg-light rounded border px-3 py-2 px-md-4 d-flex flex-column justify-content-center align-items-center w-100">
                        <div className="graph-header d-flex flex-column py-3 text-center">
                            <h5 className="h4 fw-bold">Customers</h5>
                            <small className="small fw-light text-secondary" style={{ fontSize: "12px" }}>Customers that buy products</small>
                        </div>
                        <DashboardDoughnutGraph />
                    </div>
                </div>
            </div>
            <div className="row g-2 ps-2">
                <div className="row g-2 bg-white border rounded">
                    <div className="header d-flex flex-column flex-md-row justify-content-start justify-content-md-between align-items-start p-2 ps-md-4 w-100">
                        <div className="head">
                            <h5 className='h5 fw-bolder'>Recent Orders </h5>
                        </div>
                        <div className="tools d-flex align-items-center justify-content-between justify-content-md-end col-12 col-md-4">
                            <div className="search me-1">
                                <input type="search" name="search" id="search" className="form-control" placeholder="🔍 Searching..." style={{ fontSize: "14px" }} />
                            </div>
                            <div className="select ms-1">
                                <select name="filterIncome" id="filterIncome" defaultValue="Quarterly" className="form-select" style={{ fontSize: "12px" }}>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Quarterly">Quarterly</option>
                                    <option value="Yearly">Yearly</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <RecentOrder />

                    {/* <div className="row p-2 overflow-x-scroll">
                        <div className="d-flex column-name">
                            <div className="flex-shrink-0" style={{width: "270px"}}>
                                <small className='text-secondary fw-lighter small' style={{fontSize: "10px"}}>Product Name</small>
                            </div>
                            <div className="flex-shrink-0 border" style={{width: "50px"}}>
                                <small className='text-secondary fw-lighter small' style={{fontSize: "10px"}}>Sale</small>
                            </div>
                            <div className="flex-shrink-0" style={{width: "100px"}}>
                                <small className='text-secondary fw-lighter small' style={{fontSize: "10px"}}>Stock</small>
                            </div>
                            <div className="flex-shrink-0" style={{width: "100px"}}>
                                <small className='text-secondary fw-lighter small' style={{fontSize: "10px"}}>Amount</small>
                            </div>
                            <div className="flex-shrink-0" style={{width: "150px"}}>
                                <small className='text-secondary fw-lighter small' style={{fontSize: "10px"}}>Action</small>
                            </div>
                            <div className="flex-shrink-0" style={{width: "170px"}}>
                                <small className='text-secondary fw-lighter small' style={{fontSize: "10px"}}>Status</small>
                            </div>
                        </div>
                        <div className="d-flex py-2 algin-items-center">
                            <div className="flex-shrink-0" style={{width: "270px"}}>
                                <span className='' style={{fontSize: "14px"}}>PlantSeller Rose</span>
                            </div>
                            <div className="flex-shrink-0 border" style={{width: "50px"}}>
                                <span className='' style={{fontSize: "14px"}}>9</span>
                            </div>
                            <div className="flex-shrink-0" style={{width: "100px"}}>
                                <span className='' style={{fontSize: "14px"}}>24</span>
                            </div>
                            <div className="flex-shrink-0" style={{width: "100px"}}>
                                <span className='' style={{fontSize: "14px"}}>₹ 399.00</span>
                            </div>
                            <div className="flex-shrink-0" style={{width: "150px"}}>
                                <div className='' style={{fontSize: "14px"}}></div>
                            </div>
                            <div className="flex-shrink-0" style={{width: "170px"}}>
                                <p className='text-danger' style={{fontSize: "14px"}}>Pending From your side</p>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </>
    )
}

export default Dashboard