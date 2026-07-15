import React from 'react';

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Colors
} from 'chart.js';

import { Doughnut } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    Colors,
    Tooltip,
    Legend
)

const DashboardDoughnutGraph = () => {
    const customCenterText = (chart) => {
        chart.options.info.forEach((elem, index) => {
            const { width, height } = chart;
            const ctx = chart.ctx;

            ctx.fillStyle = elem.color;
            const centerX = width / 2;
            const centerY = `${index === 0 ? height / 2.2 + 20 * index + 1 : height / 2.1 + 18 * index + 1}`;
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.font = elem.font;

            ctx.fillText(elem.text, centerX, centerY);
        });
    };

    return (
        <div style={{ width: "100%" }}>
            <Doughnut
                data={
                    {
                        labels: ['Orders', 'Products', 'Incomes'],
                        datasets: [
                            {
                                data: [20, 20, 10],
                                // backgroundColor: ['red', 'blue', 'yellow'],
                                // borderAlign: "",
                                // borderJoinStyle: 'miter'
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

                        radius: "90%",
                        maintainAspectRatio: false,
                        // responsive: true,
                        info: [
                            {
                                text: '55%',
                                font: '25px arial',
                                color: "red"
                            },
                            {
                                text: 'Total New',
                                font: '16px arial',
                                color: "black"
                            },
                            {
                                text: 'Customer.',
                                font: '16px arial',
                                color: 'black'
                            },
                        ],
                        cutout: "70%",

                    }
                } plugins={[{ beforeDraw: customCenterText }]}  className='side-view' />
        </div>

    )
}

export default DashboardDoughnutGraph