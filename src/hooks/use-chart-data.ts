import React from 'react';
import {FullChartData} from '../types';

function useChartData(): FullChartData[] {
    const [data, setData] = React.useState<FullChartData[]>([]);
    React.useEffect(() => {
        window.fetch('chart_data.json')
            .then((response) => response.json())
            .then(parse)
            .then(setData)
    }, []);
    return data;
}

function parse(raw: any[]): FullChartData[] {
    return raw.map((chart) => {
        const maybeX = Object.entries(chart.types).find(([key, value]) => value === 'x');
        const maybeYs = Object.entries(chart.types).filter(([key, value]) => value === 'line');
        const xName = maybeX ? maybeX[0] : null;
        const yNames = maybeYs.map(([key]) => key);
        if (!xName || yNames.length === 0) {
            return null;
        }
        return {
            x: {
                values: findColumnByName(chart.columns, xName)
            },
            ys: yNames.map((yName) => {
                return {
                    values: findColumnByName(chart.columns, yName),
                    color: chart.colors[yName],
                    name: chart.names[yName]
                }
            })
        }
    }).filter((x): x is FullChartData => Boolean(x));
}

type Column = [string, ...number[]];

function findColumnByName(columns: Column[], name: string): number[] | null {
    const column = columns.find(([lookupName]) => lookupName === name);
    if (!column) {
        return null;
    }
    const [, ...values] = column;
    return values;
}

export default useChartData;
