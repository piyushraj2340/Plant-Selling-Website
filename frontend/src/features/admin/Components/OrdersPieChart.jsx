import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { adminOrdersPieChartAsync } from '../adminSlice';

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

import { Doughnut, Pie } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
)

const OrdersPieChart = () => {
    const dispatch = useDispatch();
    const pieChart = useSelector(state => state.admin.ordersPieChartData);

    // Generate dynamic colors based on number of items
    const backgroundColors = pieChart.labels.map((_, i) => {
        const colors = ['#1fb36e', '#383838', '#4e84ff', '#ffb34e', '#e34eff', '#ff4e4e'];
        return colors[i % colors.length];
    });

    return (
        <div style={{ width: "100%" }}>
            <Pie
                data={
                    {
                        labels: pieChart.labels,
                        datasets: [
                            {
                                data: pieChart.data,
                                backgroundColor: backgroundColors,
                                borderAlign: "",
                                borderJoinStyle: 'miter',
                                label: "Orders"
                            },
                        ],


                    }
                }
                options={
                    {
                        plugins: {
                            legend: {
                                display: false,
                            },
                        },
                        maintainAspectRatio: false,

                    }
                }
                className='side-view' />
        </div>
    )
}

export default OrdersPieChart