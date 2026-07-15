// BarGraph.js
import React from 'react';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Colors,
} from 'chart.js';

import { Bar } from 'react-chartjs-2';

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
)



const DashboardBarGraph = () => {

    return (
        <div className="col-12" style={{ width: "100%", height: "250px" }}>
            <Bar data={{
                labels: ["Products", "Orders", "Incomes", "Ratings", "Views"],
                datasets: [
                    {
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        hoverBackgroundColor: 'rgba(50, 200, 200, 1)',
                        borderRadius: 12,
                        data: [60, 50, 44, 51, 61],
                        borderSkipped: false,
                        borderWidth: 1,
                        label: "Percentage",
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
                            display: false,
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
                            display: false,

                        },
                        border: {
                            display: false,
                        },
                    },

                },
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false,
                    }
                },
                maintainAspectRatio: false,

            }} className='main-view' />
        </div>
    );
};

export default DashboardBarGraph;
