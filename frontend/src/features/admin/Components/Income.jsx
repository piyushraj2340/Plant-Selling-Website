import React from 'react'
import OrdersBarGraph from './OrdersBarGraph'
import OrdersPieChart from './OrdersPieChart'
import OrdersTable from './OrdersTable'
import RecentOrder from './RecentOrder'

const Income = () => {
  return (
    <>
      <div className="row d-flex g-2 my-2 h-auto">
        <div className="bar-graph col-12 col-lg-8">
          <div className="bg-light rounded border px-3 py-2 px-md-4 d-flex flex-column align-items-center w-100">
            <div className="graph-header w-100 d-flex justify-content-between align-content-center py-3">
              <div className="left d-flex flex-column">
                <h5 className="h4 fw-bold">Overview </h5>
                <small className="small fw-light text-secondary" style={{ fontSize: "12px" }}>Monthly Orders</small>
              </div>
              <div className="right">
                <select name="filterIncome" id="filterIncome" defaultValue="2023" className="form-select" style={{ fontSize: "12px" }}>
                  <option value="2020">2020</option>
                  <option value="2021">2021</option>
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                  <option value="2023">2023</option>
                  <option value="2023">2023</option>
                  <option value="2023">2023</option>
                  <option value="2023">2023</option>
                </select>
              </div>
            </div>
            <OrdersBarGraph />
          </div>
        </div>
        <div className="bar-graph col-12 col-lg-4">
          <div className="bg-light rounded border px-3 py-2 px-md-4 d-flex flex-column justify-content-center align-items-center">
            <div className="graph-header d-flex flex-column py-3 text-center">
              <h5 className="h4 fw-bold">Orders</h5>
              <small className="small fw-light text-secondary" style={{ fontSize: "12px" }}>Orders Based on Categories.</small>
            </div>
            <OrdersPieChart />
          </div>
        </div>
      </div>
      <div className="row g-2 ps-2">
        <div className="row g-2 my-2 bg-white border rounded">
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
          <OrdersTable /> {/* Add Rating, Review into the component */}
        </div>
      </div>
    </>
  )
}

export default Income