import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import IncomeBarGraph from './IncomeBarGraph'
import IncomePieChart from './IncomePieChart'
import IncomeTable from './IncomeTable'
import { adminIncomeBarChartAsync, adminIncomePieChartAsync } from '../adminSlice'

const Income = () => {
  const dispatch = useDispatch();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const yearOptions = Array.from(
      { length: currentYear - 2020 + 1 },
      (_, i) => 2020 + i
  );

  useEffect(() => {
    dispatch(adminIncomeBarChartAsync(selectedYear));
    dispatch(adminIncomePieChartAsync(selectedYear));
  }, [dispatch, selectedYear]);

  return (
    <>
      <div className="row d-flex g-2 my-2 h-auto">
        <div className="bar-graph col-12 col-lg-8">
          <div className="bg-light rounded border px-3 py-2 px-md-4 d-flex flex-column align-items-center w-100">
            <div className="graph-header w-100 d-flex justify-content-between align-content-center py-3">
              <div className="left d-flex flex-column">
                <h5 className="h4 fw-bold">Overview </h5>
                <small className="small fw-light text-secondary" style={{ fontSize: "12px" }}>Monthly Income</small>
              </div>
              <div className="right">
                <select 
                    name="filterYear" 
                    id="filterYear" 
                    value={selectedYear} 
                    onChange={(e) => setSelectedYear(e.target.value)} 
                    className="form-select" 
                    style={{ fontSize: "12px" }}
                >
                  {yearOptions.map(year => (
                      <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
            <IncomeBarGraph />
          </div>
        </div>
        <div className="bar-graph col-12 col-lg-4">
          <div className="bg-light rounded border px-3 py-2 px-md-4 d-flex flex-column justify-content-center align-items-center">
            <div className="graph-header d-flex flex-column py-3 text-center">
              <h5 className="h4 fw-bold">Revenue</h5>
              <small className="small fw-light text-secondary" style={{ fontSize: "12px" }}>Revenue Based on Categories.</small>
            </div>
            <IncomePieChart />
          </div>
        </div>
      </div>
      <div className="row g-2 ps-2">
        <div className="row g-2 my-2 bg-white border rounded">
          <div className="header d-flex flex-column flex-md-row justify-content-start justify-content-md-between align-items-start p-2 ps-md-4 w-100">
            <div className="head">
              <h5 className='h5 fw-bolder'>Transaction History </h5>
            </div>
          </div>
          <div className="table w-100 p-0 m-0">
            <IncomeTable />
          </div>
        </div>
      </div>
    </>
  )
}

export default Income