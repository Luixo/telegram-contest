import React from 'react';
import styled from '@emotion/styled';
import {ThemeContext} from '../../context/theme';
import Grid, {GridData} from './grid';
import Line from './line';
import Circle from './circle';
import Lines, {LinePointsData} from './lines';
import PointDataPopup from './../point-data-popup';
import Error from '../error';
import {ChartOptions, Point, PointData} from '../../types';

interface Props {
    linePointsSet: Point[][];
    linePointsSetData: LinePointsData[];
    chartOptions: ChartOptions;
    gridData: GridData;
    findPointData: (x: number) => PointData;
}

// top popup margin + popup height + circle radius + margin from circle to popup
const POPUP_HEIGHT_THRESHOLD = 20 + 85 + 5 + 5;

const Wrapper = styled.div({
    position: 'relative'
});

const Svg = styled.svg({
    overflow: 'visible'
});

const Chart: React.FC<Props> = React.memo((props) => {
    const [pointData, setPointData] = React.useState<PointData | null>(null);
    const chartOptions = props.chartOptions;
    const {grid} = React.useContext(ThemeContext);
    if (props.linePointsSetData.every((data) => !data.isOn)) {
        return <Error width={chartOptions.outerWidth} height={chartOptions.outerHeight}/>
    }
    const xOffset = (chartOptions.outerHeight - chartOptions.innerHeight) / 2;
    return (
        <Wrapper
            onMouseMove={(e) => {
                const target = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - target.left;
                const y = e.clientY - target.top;
                if (x < 0 || y < 0) {
                    setPointData(null);
                    return;
                }
                setPointData(props.findPointData(x));
            }}
            onMouseLeave={() => setPointData(null)}
        >
            <Svg
                width={chartOptions.outerWidth}
                height={chartOptions.outerHeight}
            >
                <Grid
                    data={props.gridData}
                    chartOptions={chartOptions}
                    legend
                >
                    <Lines linePointsSet={props.linePointsSet} linePointsSetData={props.linePointsSetData} />
                </Grid>
                {pointData ?
                    <g>
                        <Line
                            stroke={grid.lineStroke}
                            points={[
                                [pointData[0].coordinate, xOffset],
                                [pointData[0].coordinate, chartOptions.innerHeight + xOffset]
                            ]}
                        />
                        {pointData[1].map((yData) =>
                           <Circle key={yData.text} x={pointData[0].coordinate} y={yData.coordinate} outlineColor={yData.color} />
                        )}
                    </g> :
                    null
                }
            </Svg>
            {pointData ?
                <PointDataPopup
                    data={pointData}
                    isTop={pointData[1].every((point) => point.coordinate > POPUP_HEIGHT_THRESHOLD)}
                    width={chartOptions.innerWidth}
                /> :
                null
            }
        </Wrapper>
    );
});

export default Chart;
