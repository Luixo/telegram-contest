import React from 'react';
import styled from '@emotion/styled';
import utils from '../../utils/utils';
import useAxesLines from '../../hooks/use-axes-lines';
import useDateLines from '../../hooks/use-date-lines';
import Line from './line';
import {ThemeContext} from '../../context/theme';
import {ChartOptions} from '../../types';

interface GridData {
    minY: number;
    maxY: number;
    // coordinate, value
    xData: [number, number][];
}

interface Props {
    legend?: boolean;
    data: GridData;
    chartOptions: ChartOptions;
}

const TEXT_HEIGHT = 14;

const Text = styled.text<{color: string}>(({color}) => ({
    fill: color,
    fontSize: '75%'
}));

const Grid: React.FC<Props> = React.memo((props) => {
    const chartOptions = props.chartOptions;
    const axesLines = useAxesLines({
        min: props.data.minY,
        max: props.data.maxY,
        size: chartOptions.innerHeight,
        counterSideSize: chartOptions.innerWidth,
        shift: (chartOptions.outerHeight - chartOptions.innerHeight) / 2,
        linesAmount: 4
    });
    const dateLines = useDateLines({
        width: chartOptions.innerWidth,
        firstDate: props.data.xData[0],
        lastDate: props.data.xData[props.data.xData.length - 1]
    });

    const {grid} = React.useContext(ThemeContext);
    return (
        <g>
            {axesLines.map(([value, start, end], index) => (
                <g key={index}>
                    <Line stroke={grid.lineStroke} points={[start, end]} />
                    {props.legend ?
                        <Text color={grid.textColor} x={start[0]} y={start[1] - 10}>
                            {utils.prettyNumber(value)}
                        </Text> :
                        null
                    }
                </g>
            ))}
            <g>
                {dateLines.map(({coordinate, value}) => (
                    <Text
                        textAnchor="middle"
                        key={coordinate}
                        color={grid.textColor}
                        x={coordinate}
                        y={chartOptions.outerHeight - ((chartOptions.outerHeight - chartOptions.innerHeight) / 2) + TEXT_HEIGHT}
                    >
                        {value}
                    </Text>
                ))}
            </g>
            {props.children}
        </g>
    );
});

export default Grid;
export {GridData};
