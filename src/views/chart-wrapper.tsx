import React from 'react';
import styled from '@emotion/styled';
import useLinePointsSet from '../hooks/use-line-points-set';
import useAnimatedNumberEffect from '../hooks/use-animated-number-effect';
import usePointDataEvaluator from '../hooks/use-point-data-evaluator';
import Chart from './svg/chart';
import Lines from './svg/lines';
import ThumbWindow from './svg/thumb-window';
import MultipleSwitchBox from './controls/multiple-switch-box';
import {FullChartData} from '../types';

interface Props {
    chart: FullChartData;
    width: number;
    title: string;
}

const MIN_CHART_WIDTH = 100;
const CHART_HEIGHT = 400;
const SIZE_WINDOW_HEIGHT = 70;
const OUTER_MARGIN = 0.05;
const DEFAULT_START_BORDER = 50;
const DEFAULT_END_BORDER = 70;
const CHART_VERTICAL_MARGIN = 0.05;

const SHIFT_ANIMATION_TIME = 300;

const Wrapper = styled.div<{padding: number}>(({padding}) => ({
    display: 'flex',
    flexDirection: 'column',
    padding,
    boxSizing: 'border-box',
    userSelect: 'none',
    '& > *:not(:first-child)': {
        marginTop: 12
    }
}));

const OverflowWrapper = styled.div({
    overflow: 'hidden'
});

const Title = styled.h1({
    fontSize: '170%',
    fontWeight: 'bold'
});

const Svg = styled.svg({
    overflow: 'visible'
});

const ChartWrapper: React.FC<Props> = (props) => {
    const constrainedWidth = Math.max(props.width, MIN_CHART_WIDTH);
    const chartOuterOffset = constrainedWidth * (OUTER_MARGIN / 2);
    const chartsWidth = constrainedWidth * (1 - OUTER_MARGIN);
    const chartHeight = CHART_HEIGHT * (1 - 2 * CHART_VERTICAL_MARGIN);
    const chartVerticalMargin = CHART_HEIGHT * CHART_VERTICAL_MARGIN;
    const thumbHeight = SIZE_WINDOW_HEIGHT * (1 - 2 * CHART_VERTICAL_MARGIN);
    const thumbVerticalMargin = SIZE_WINDOW_HEIGHT * CHART_VERTICAL_MARGIN;

    const [leftBorder, setLeftBorder] = React.useState(DEFAULT_START_BORDER);
    const [rightBorder, setRightBorder] = React.useState(DEFAULT_END_BORDER);
    const onePercentInPixels = chartsWidth / (rightBorder - leftBorder);

    const xValues = props.chart.x.values;
    const minMaxX: [number, number] = [xValues[0], xValues[xValues.length - 1]];
    const [leftBorderPointIndex, rightBorderPointIndex] = React.useMemo<[number, number]>(
        () => {
            const [minX, maxX] = minMaxX;
            const totalX = maxX - minX;
            const leftXValue = minX + totalX * leftBorder / 100;
            const rightXValue = minX + totalX * rightBorder / 100;
            const leftBorderXIndex = xValues.findIndex((x) => x >= leftXValue);
            const rightBorderXIndex = xValues.length - 1 - [...xValues].reverse().findIndex((x) => x <= rightXValue);
            return [leftBorderXIndex, rightBorderXIndex];
        },
        [leftBorder, rightBorder, minMaxX, xValues]
    );
    
    const yValuesSet = props.chart.ys.map((yValuesWithData) => yValuesWithData.values);
    const [activeYs, setActiveYs] = React.useState<boolean[]>(yValuesSet.map(() => true));
    
    const maxY = useAnimatedNumberEffect(
        () => Math.max(...yValuesSet.map((y) => Math.max(...y))),
        [yValuesSet],
        SHIFT_ANIMATION_TIME
    );
    const minMaxY: [number, number] = [0, maxY];
    

    const maxYInWindow = useAnimatedNumberEffect(() => {
            const visibleYValues = yValuesSet.filter((_, index) => activeYs[index]);
            return Math.max(...visibleYValues.map((y) =>
                Math.max(...y.filter((_, index) => index >= leftBorderPointIndex && index <= rightBorderPointIndex))
            ))
        },
        [activeYs, props.chart.ys, leftBorderPointIndex, rightBorderPointIndex],
        SHIFT_ANIMATION_TIME
    );
    const minMaxYInWindow: [number, number] = [0, maxYInWindow];
    
    const bigLinePoints = useLinePointsSet({
        xValues,
        yValuesSet,
        width: onePercentInPixels * 100,
        height: chartHeight,
        minMaxY: minMaxYInWindow,
        minMaxX,
        xShift: -(leftBorder * onePercentInPixels),
        yShift: chartVerticalMargin
    });
    const thumbLinePoints = useLinePointsSet({
        xValues,
        yValuesSet,
        width: chartsWidth,
        height: thumbHeight,
        minMaxY,
        minMaxX,
        xShift: 0,
        yShift: thumbVerticalMargin
    });
    const yDatas = React.useMemo(
        () => props.chart.ys.map((y, index) => ({
            text: y.name,
            color: y.color,
            isOn: activeYs[index]
        })),
        [props.chart.ys, activeYs]
    );
    const xCoordinatesAndValues = React.useMemo(() =>
        bigLinePoints[0].map<[number, number]>(([x], index) => [x, xValues[index]])
    , [xValues, minMaxX, onePercentInPixels]);
    const pointDataEvaluator = usePointDataEvaluator({
        xCoordinatesAndValues,
        yValuesSet,
        lines: bigLinePoints,
        borders: [0, chartsWidth],
        yDatas
    });
    const chartOptions = React.useMemo(() => ({
        outerWidth: chartsWidth,
        innerWidth: chartsWidth,
        outerHeight: chartHeight + chartVerticalMargin * 2,
        innerHeight: chartHeight,
        verticalMargin: chartVerticalMargin,
        horizontalMargin: 0
    }), [chartsWidth, chartHeight, chartVerticalMargin]);
    const gridData = React.useMemo(() => ({
        minY: minMaxYInWindow[0],
        maxY: minMaxYInWindow[1],
        xData: xCoordinatesAndValues.filter(([x]) => x > 0 && x < chartsWidth)
    }), [minMaxYInWindow, xCoordinatesAndValues]);

    return (
        <Wrapper padding={chartOuterOffset}>
            <Title>{props.title}</Title>
            <OverflowWrapper>
                <Chart
                    linePointsSet={bigLinePoints}
                    linePointsSetData={yDatas}
                    gridData={gridData}
                    chartOptions={chartOptions}
                    findPointData={pointDataEvaluator}
                />
            </OverflowWrapper>
            <ThumbWindow
                height={thumbHeight + thumbVerticalMargin * 2}
                width={chartsWidth}
                left={leftBorder}
                right={rightBorder}
                onChangeLeft={setLeftBorder}
                onChangeRight={setRightBorder}
            >
                <Svg width={chartsWidth} height={thumbHeight + thumbVerticalMargin * 2}>
                    <Lines
                        linePointsSet={thumbLinePoints}
                        linePointsSetData={yDatas.map((yData) => ({...yData, isOn: true}))}
                    />
                </Svg>
            </ThumbWindow>
            <MultipleSwitchBox
                values={yDatas}
                setActivated={setActiveYs}
            />
        </Wrapper>
    );
};

export default ChartWrapper;
