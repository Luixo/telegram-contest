import React from 'react';
import {Point} from '../types';

interface PointsData {
    xValues: number[];
    yValuesSet: number[][];
    width: number;
    height: number;
    minMaxX: [number, number];
    minMaxY: [number, number];
    xShift?: number;
    yShift?: number;
}

function useLinePointsSet({xValues, yValuesSet, width, height, minMaxX, minMaxY, yShift = 0, xShift = 0}: PointsData): Point[][] {
    return React.useMemo<Point[][]>(() => yValuesSet.map<Point[]>(
        (yValues) => yValues.map<Point>((yValue, index) => [
            normalize(minMaxX, width, xValues[index]) + xShift,
            height - normalize(minMaxY, height, yValue) + yShift
        ])
    ), [xValues, yValuesSet, width, height, minMaxX[0], minMaxX[1], minMaxY[0], minMaxY[1], yShift, xShift]);
}

function normalize([min, max]: [number, number], size: number, point: number): number {
    const amplifier = size / (max - min);
    return (point - min) * amplifier;
}

export default useLinePointsSet;
