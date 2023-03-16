import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';

export default function Statistique(props) {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const data = {
            labels: ['Tarif E', 'Tarif L1', 'Tarif L2'],
            datasets: [
                {
                    label: 'Nombre',
                    borderColor: documentStyle.getPropertyValue('--pink-400'),
                    pointBackgroundColor: documentStyle.getPropertyValue('--pink-400'),
                    pointBorderColor: documentStyle.getPropertyValue('--pink-400'),
                    pointHoverBackgroundColor: textColor,
                    pointHoverBorderColor: documentStyle.getPropertyValue('--pink-400'),
                    data: props.dtChart
                }
            ]
        };
        const options = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                r: {
                    grid: {
                        color: textColorSecondary
                    }
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, [props.dtChart]);

    return (
        <div className="card flex justify-content-center">
            <Chart type="radar" data={chartData} options={chartOptions} className="w-full md:w-30rem" />
        </div>
    )
}