import React from 'react';
import { useSelector } from 'react-redux';

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
    const { ordersData } = useSelector(state => state.admin);
    const pieChart = ordersData?.stats?.pieChart || { labels: ['FLOWER', 'INDOOR PLANTS', 'PLANTS'], data: [20, 20, 10] };

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