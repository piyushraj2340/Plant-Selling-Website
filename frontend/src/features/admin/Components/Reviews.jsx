import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import ProductsTable from './ProductsTable'
import ReviewsTable from './ReviewsTable'
import ReviewsPieChart from './ReviewsPieChart'
import ReviewLineChart from './ReviewLineChart'
import { adminReviewsLineChartAsync, adminReviewsPieChartAsync } from '../adminSlice'

const Reviews = () => {
    const dispatch = useDispatch();
    
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);

    // Generate years from 2020 to current year
    const yearOptions = Array.from(
        { length: currentYear - 2020 + 1 },
        (_, i) => 2020 + i
    );

    useEffect(() => {
        dispatch(adminReviewsLineChartAsync(selectedYear));
        dispatch(adminReviewsPieChartAsync(selectedYear));
    }, [dispatch, selectedYear]);

    return (
        <>

            <div className="row d-flex g-2 my-2 h-auto">
                <div className="bar-graph col-12 col-lg-8">
                    <div className="bg-light rounded border px-3 py-2 px-md-4 d-flex flex-column align-items-center w-100">
                        <div className="graph-header w-100 d-flex justify-content-between align-content-center py-3">
                            <div className="left d-flex flex-column">
                                <h5 className="h4 fw-bold">Store Rating</h5>
                                <small className="small fw-light text-secondary" style={{ fontSize: "12px" }}>Monthly store ratings</small>
                            </div>
                            <div className="right">
                                <select 
                                    name="filterIncome" 
                                    id="filterIncome" 
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
                        <ReviewLineChart />
                    </div>
                </div>
                <div className="bar-graph col-12 col-lg-4">
                    <div className="bg-light rounded border px-3 py-2 px-md-4 d-flex flex-column justify-content-center align-items-center">
                        <div className="graph-header d-flex flex-column py-3 text-center">
                            <h5 className="h4 fw-bold">Rating</h5>
                            <small className="small fw-light text-secondary" style={{ fontSize: "12px" }}>Average ratings of all products</small>
                        </div>
                        <ReviewsPieChart />
                    </div>
                </div>
            </div>
            <div className="row g-2 ps-2">
                <div className="row g-2 my-2 bg-white border rounded">
                    <div className="header d-flex flex-column flex-md-row justify-content-start justify-content-md-between align-items-start p-2 ps-md-4 w-100">
                    </div>
                    <ReviewsTable />
                </div>
            </div>
        </>
    )
}

export default Reviews