import React from 'react';
import { useSelector } from 'react-redux';

import {
    Chart as ChartJS,
    PolarAreaController,
    Tooltip,
    Legend,
    RadialLinearScale
} from 'chart.js';

import { PolarArea } from 'react-chartjs-2';

ChartJS.register(
    PolarAreaController,
    RadialLinearScale,
    Tooltip,
    Legend
)

const ProductsPolarAreaChart = () => {
    const polarChartData = useSelector(state => state.admin.productsData.stats.polarChart) || [0, 0, 0];

    return (
        <div style={{ width: "100%" }}>


            <PolarArea
                data={
                    {
                        labels: ['PUBLISHED', 'DRAFT', 'ON HOLD'],
                        datasets: [
                            {
                                data: polarChartData,
                                backgroundColor: ['#1fb36e', 'gray', '#4e84ff'],
                                // borderAlign: 'center'
                                hoverBackgroundColor: "rgba(90, 90, 90,0.5)",
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

                        radius: "70%",
                        maintainAspectRatio: false,

                    }
                } className='side-view' />
        </div>
    )
}

export default ProductsPolarAreaChart