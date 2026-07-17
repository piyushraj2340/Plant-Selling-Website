import React from 'react'
import { useSelector } from 'react-redux'
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
)

const IncomeBarGraph = () => {
    const { incomeData } = useSelector(state => state.admin);
    const barData = incomeData?.stats?.barChart || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    return (
        <div className='col-12' style={{ width: "100%", height: "250px" }}>
            <Bar data={{
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                datasets: [
                    {
                        label: 'Income (₹)',
                        backgroundColor: 'rgba(255, 159, 64, 0.2)',
                        borderWidth: 1,
                        borderColor: 'rgba(255, 159, 64, 1)',
                        hoverBackgroundColor: 'rgba(255, 159, 64, 1)',
                        borderRadius: 12,
                        data: barData,
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
                            display: false,
                        },
                        border: {
                            display: false,
                        },
                    },
                    y: {
                        display: true,
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
    )
}

export default IncomeBarGraph
