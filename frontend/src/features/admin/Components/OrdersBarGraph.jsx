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

const OrdersBarGraph = () => {
    const { ordersData } = useSelector(state => state.admin);
    const barData = ordersData?.stats?.barChart || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    return (
        <div className='col-12' style={{ width: "100%", height: "250px" }}>
            <Bar data={{
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                datasets: [
                    {
                        label: 'Orders',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderWidth: 1,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        hoverBackgroundColor: 'rgba(50, 200, 200, 1)',
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
                        display: false,
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

export default OrdersBarGraph