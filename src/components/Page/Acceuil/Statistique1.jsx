import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';

export default function Statistique1(props) {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        // console.log(props.dtChart)
        const documentStyle = getComputedStyle(document.documentElement);
        const data = {
            labels:  ['RADIOGRAPHIE', 'AUTRES', 'ECHOGRAPHIE', 'SCANNER', 'PANORAMIQUE DENTAIRE', 'ECG', 'MAMMOGRAPHIE'],
            datasets: [
                {
                    data: props.dtChart,
                    backgroundColor: [
                        '#F97316', 
                        '#A855F7', 
                        '#06B6D4',
                        '#9E9E9E',
                        '#7F7CF8',
                        '#225FFF',
                        '#F27380',
                    ],
                    hoverBackgroundColor: [
                        '#F97316', 
                        '#A855F7', 
                        '#06B6D4',
                        '#9E9E9E',
                        '#7F7CF8',
                        '#225FFF',
                        '#F27380',
                    ]
                }
            ]
        };
        const options = {
            cutout: '60%'
        };

        setChartData(data);
        setChartOptions(options);
    }, [props.dtChart]);

    return (
        <div className="card flex justify-content-center">
            <Chart type="pie" data={chartData} options={chartOptions} className="w-full md:w-30rem" />
        </div>
    )
}