import React from 'react'
import ProductsTable from './ProductsTable'
import ProductsLineChart from './ProductsLineChart'
import ProductsPolarAreaChart from './ProductsPolarAreaChart'

const Products = () => {
  return (
    <>
      {/* <header className="row g-2">
        <div className="col-md-6 col-xl-3 rounded">
            <div className="d-flex bg-light align-items-center border p-2">
                <div className="icon rounded-circle border d-flex justify-content-center align-items-center" style={{ fontSize: "3rem", backgroundColor: "#a8f3a8", width: "6rem", height: "6rem" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                        <path d="M271.06,144.3l54.27,14.3a8.59,8.59,0,0,1,6.63,8.1c0,4.6-4.09,8.4-9.12,8.4h-35.6a30,30,0,0,1-11.19-2.2c-5.24-2.2-11.28-1.7-15.3,2l-19,17.5a11.68,11.68,0,0,0-2.25,2.66,11.42,11.42,0,0,0,3.88,15.74,83.77,83.77,0,0,0,34.51,11.5V240c0,8.8,7.83,16,17.37,16h17.37c9.55,0,17.38-7.2,17.38-16V222.4c32.93-3.6,57.84-31,53.5-63-3.15-23-22.46-41.3-46.56-47.7L282.68,97.4a8.59,8.59,0,0,1-6.63-8.1c0-4.6,4.09-8.4,9.12-8.4h35.6A30,30,0,0,1,332,83.1c5.23,2.2,11.28,1.7,15.3-2l19-17.5A11.31,11.31,0,0,0,368.47,61a11.43,11.43,0,0,0-3.84-15.78,83.82,83.82,0,0,0-34.52-11.5V16c0-8.8-7.82-16-17.37-16H295.37C285.82,0,278,7.2,278,16V33.6c-32.89,3.6-57.85,31-53.51,63C227.63,119.6,247,137.9,271.06,144.3ZM565.27,328.1c-11.8-10.7-30.2-10-42.6,0L430.27,402a63.64,63.64,0,0,1-40,14H272a16,16,0,0,1,0-32h78.29c15.9,0,30.71-10.9,33.25-26.6a31.2,31.2,0,0,0,.46-5.46A32,32,0,0,0,352,320H192a117.66,117.66,0,0,0-74.1,26.29L71.4,384H16A16,16,0,0,0,0,400v96a16,16,0,0,0,16,16H372.77a64,64,0,0,0,40-14L564,377a32,32,0,0,0,1.28-48.9Z" fill="rgb(3 122 3)" />
                    </svg>
                </div>
                <div className="icon-content text-dark ps-3 pe-1 d-flex flex-column justify-content-center">
                    <small className="small fw-lighter" style={{ fontSize: "14px" }}>Earning</small>
                    <b className="fw-bold">$198k</b>
                    <span className="small"><small className="small fw-bold" style={{ color: "rgb(3 122 3)" }}><i className="fas fa-arrow-up"></i> 37.8%</small> this month</span>
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
                    <b className="fw-bold">$2.4k</b>
                    <span className="small"><small className="small fw-bold" style={{ color: "#9f0252" }}><i className="fas fa-arrow-down"></i> 2%</small> this month</span>
                </div>
            </div>
        </div>
        <div className="col-md-6 col-xl-3 rounded">
            <div className="d-flex bg-light align-items-center border p-2">
                <div className="icon rounded-circle border d-flex justify-content-center align-items-center" style={{ fontSize: "3rem", backgroundColor: "#7ce9f9", color: "#026c7c", width: "6rem", height: "6rem" }}>
                    <i className="fas fa-wallet"></i>
                </div>
                <div className="icon-content text-dark ps-3 pe-1 d-flex flex-column justify-content-center">
                    <small className="small fw-lighter" style={{ fontSize: "14px" }}>Balance</small>
                    <b className="fw-bold">$2.4k</b>
                    <span className="small"><small className="small fw-bold" style={{ color: "#9f0252" }}><i className="fas fa-arrow-down"></i> 2%</small> this month</span>
                </div>
            </div>
        </div>
        <div className="col-md-6 col-xl-3 rounded">
            <div className="d-flex bg-light align-items-center border p-2">
                <div className="icon rounded-circle border d-flex justify-content-center align-items-center" style={{ fontSize: "3rem", backgroundColor: "#fd9bdb", color: "#c60056", width: "6rem", height: "6rem" }}>
                    <i className="fas fa-shopping-bag"></i>
                </div>
                <div className="icon-content text-dark ps-3 pe-1 d-flex flex-column justify-content-center">
                    <small className="small fw-lighter" style={{ fontSize: "14px" }}>Sales</small>
                    <b className="fw-bold">$89k</b>
                    <span className="small"><small className="small fw-bold" style={{ color: "rgb(3 122 3)" }}><i className="fas fa-arrow-up"></i> 11%</small> this month</span>
                </div>
            </div>
        </div>
    </header> */}
      <div className="row d-flex g-2 my-2 h-auto">
        <div className="bar-graph col-12 col-lg-8">
          <div className="bg-light rounded border px-3 py-2 px-md-4 d-flex flex-column align-items-center w-100">
            <div className="graph-header w-100 d-flex justify-content-between align-content-center py-3">
              <div className="left d-flex flex-column">
                <h5 className="h4 fw-bold">Products</h5>
                <small className="small fw-light text-secondary" style={{ fontSize: "12px" }}>Monthly Published Products</small>
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
            <ProductsLineChart />
          </div>
        </div>
        <div className="bar-graph col-12 col-lg-4">
          <div className="bg-light rounded border px-3 py-2 px-md-4 d-flex flex-column justify-content-center align-items-center">
            <div className="graph-header d-flex flex-column py-3 text-center">
              <h5 className="h4 fw-bold">Status</h5>
              <small className="small fw-light text-secondary" style={{ fontSize: "12px" }}>Status of the products</small>
            </div>
            <ProductsPolarAreaChart />
          </div>
        </div>
      </div>
      <div className="row g-2 ps-2">
        <div className="row g-2 my-2 bg-white border rounded">
          <div className="header d-flex flex-column flex-md-row justify-content-start justify-content-md-between align-items-start p-2 ps-md-4 w-100">
            <div className="head">
              <h5 className='h5 fw-bolder'>Products </h5>
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
          <ProductsTable />
        </div>
      </div>
    </>
  )
}

export default Products