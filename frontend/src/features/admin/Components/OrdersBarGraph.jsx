import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { adminOrdersBarChartAsync } from '../adminSlice';
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
    const dispatch = useDispatch();
    const barData = useSelector(state => state.admin.ordersBarChartData);

    useEffect(() => {
        dispatch(adminOrdersBarChartAsync(new Date().getFullYear()));
    }, [dispatch]);

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