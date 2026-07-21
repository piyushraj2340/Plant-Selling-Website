import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import ProductsTable from './ProductsTable'
import ProductsLineChart from './ProductsLineChart'
import ProductsPolarAreaChart from './ProductsPolarAreaChart'
import { adminProductsAsync } from '../adminSlice'

const Products = () => {
  const dispatch = useDispatch();
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    dispatch(adminProductsAsync({ year, search, filter }));
  }, [dispatch, year, search, filter]);

  return (
    <>
      <div className="row d-flex g-2 my-2 h-auto">
        <div className="bar-graph col-12 col-lg-8">
          <div className="bg-light rounded border px-3 py-2 px-md-4 d-flex flex-column align-items-center w-100">
            <div className="graph-header w-100 d-flex justify-content-between align-content-center py-3">
              <div className="left d-flex flex-column">
                <h5 className="h4 fw-bold">Products</h5>
                <small className="small fw-light text-secondary" style={{ fontSize: "12px" }}>Monthly Published Products</small>
              </div>
              <div className="right">
                <select name="filterYear" id="filterYear" value={year} onChange={(e) => setYear(e.target.value)} className="form-select" style={{ fontSize: "12px" }}>
                  <option value={currentYear - 3}>{currentYear - 3}</option>
                  <option value={currentYear - 2}>{currentYear - 2}</option>
                  <option value={currentYear - 1}>{currentYear - 1}</option>
                  <option value={currentYear}>{currentYear}</option>
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
          <ProductsTable />
        </div>
      </div>
    </>
  )
}

export default Products