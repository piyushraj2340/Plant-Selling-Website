import React from 'react';

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



const ReviewLineChart = () => {
    return (
        <div className='col-12' style={{ width: "100%", height: "250px" }}>
            <Line data={{
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                datasets: [
                    {
                        label: null,
                        borderWidth: 1,
                        borderRadius: 12,
                        data: [60, 50, 38, 44, 51, 67, 70, 20, 48, 44, 20, 27],
                        borderSkipped: false,
                        label: "Products"
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
            }} className='main-view' />

        </div>
    )
}

export default ReviewLineChart