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



const DashboardBarGraph = ({ data }) => {
    const labels = data?.labels || ["No Data"];
    const graphData = data?.data || [0];

    return (
        <div className="col-12" style={{ width: "100%", height: "250px" }}>
            <Bar data={{
                labels: labels,
                datasets: [
                    {
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        hoverBackgroundColor: 'rgba(50, 200, 200, 1)',
                        borderRadius: 12,
                        data: graphData,
                        borderSkipped: false,
                        borderWidth: 1,
                        label: "Revenue",
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
