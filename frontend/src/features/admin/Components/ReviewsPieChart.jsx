import React from 'react';
import { useSelector } from 'react-redux';

import {
    Chart as ChartJS,
    PolarAreaController,
    Tooltip,
    Legend,
    RadialLinearScale
} from 'chart.js';

import { Pie } from 'react-chartjs-2';

ChartJS.register(
    PolarAreaController,
    RadialLinearScale,
    Tooltip,
    Legend
)

const ReviewsPieChart = () => {

  const { reviewsPieChartData } = useSelector(state => state.admin);
  const pieData = reviewsPieChartData?.data?.length ? reviewsPieChartData.data : [0, 0, 0, 0, 0];

  return (
    <div style={{ width: "100%" }}>


            <Pie
                data={
                    {
                        labels: ['1 Star Rating', '2 Star Rating', '3 Star Rating', '4 Star Rating', '5 Star Rating'],
                        datasets: [
                            {
                                data: pieData,
                                backgroundColor: ['#dc3545','#6c757d','#ffc107', '#4e84ff','#1fb36e'],
                                // borderAlign: 'center'
                                hoverBackgroundColor: "rgba(90, 90, 90,0.5)",
                                label: "Reviews"
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

export default ReviewsPieChart