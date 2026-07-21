import React from 'react';
import { useSelector } from 'react-redux';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
)

const IncomePieChart = () => {
    const { incomeData } = useSelector(state => state.admin);
    const pieChart = incomeData?.stats?.pieChart || { labels: [], data: [] };

    // Generate dynamic colors based on number of items
    const backgroundColors = (pieChart.labels || []).map((_, i) => {
        const colors = ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#26b99a', '#f39c12'];
        return colors[i % colors.length];
    });

    return (
        <div style={{ width: "100%" }}>
            {pieChart.labels && pieChart.labels.length > 0 ? (
                <Pie
                    data={{
                        labels: pieChart.labels,
                        datasets: [
                            {
                                data: pieChart.data,
                                backgroundColor: backgroundColors,
                                borderAlign: "",
                                borderJoinStyle: 'miter',
                                label: "Revenue"
                            },
                        ],
                    }}
                    options={{
                        plugins: {
                            legend: {
                                display: false,
                            },
                        },
                        maintainAspectRatio: false,
                    }}
                    className='side-view'
                />
            ) : (
                <p style={{minHeight: "153px"}} className="text-muted text-center my-5">No category revenue data available.</p>
            )}
        </div>
    )
}

export default IncomePieChart
