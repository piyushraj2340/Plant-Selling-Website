// BarGraph.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { adminPlantsLineChartAsync } from '../adminSlice';
import {
    Chart as ChartJS,
    Tooltip,
    Legend,
    LineController,
    PointElement,
    LineElement,
    Colors,
} from 'chart.js';

import { Line } from 'react-chartjs-2';

ChartJS.register(
    LineController,
    PointElement,
    LineElement,
    Tooltip,
    Colors,
    Legend
)


const ProductsLineChart = () => {
    const dispatch = useDispatch();
    const lineChartData = useSelector(state => state.admin.plantsLineChartData) || new Array(12).fill(0);

    useEffect(() => {
        dispatch(adminPlantsLineChartAsync(new Date().getFullYear()));
    }, [dispatch]);

    return (
        <div className='col-12' style={{ width: "100%", height: "250px" }}>
            <Line data={{
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                datasets: [
                    {
                        label: "Products",
                        borderWidth: 1,
                        borderRadius: 12,
                        data: lineChartData,
                        borderSkipped: false,
                    },
                ],
            }} options={{

                scales: {
                    x: {
                        ticks: {
                            display: true,
                            color: 'red',
                        },
                        grid: {
                            display: true,
                        },
                        border: {
                            display: false,
                        },
                    },
                    y: {
                        ticks: {
                            display: true,
                            color: 'red',
                        },
                        grid: {
                            display: true,
                        },
                        border: {
                            display: false,
                        },
                        beginAtZero: true,
                    },
                },

                plugins: {
                    legend: {
                        display: false,
                    },
                },
                maintainAspectRatio: false,
            }} className='main-view'/>

        </div>
    );
};

export default ProductsLineChart;
