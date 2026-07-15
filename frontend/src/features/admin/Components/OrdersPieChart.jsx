import React from 'react';

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
    return (
        <div style={{ width: "100%" }}>
            <Pie
                data={
                    {
                        labels: ['FLOWER', 'INDORE PLANTS', 'PLANTS'],
                        datasets: [
                            {
                                data: [20, 20, 10],
                                backgroundColor: ['#1fb36e', '#383838', '#4e84ff'],
                                borderAlign: "",
                                borderJoinStyle: 'miter',
                                label: "Percentage"
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