import React from 'react';
import {Point, PointData} from '../types';

interface RawYData {
    text: string;
    color: string;
    isOn: boolean;
}

interface Options {
    xCoordinatesAndValues: [number, number][];
    yValuesSet: number[][];
    lines: Point[][];
    borders: [number, number];
    yDatas: RawYData[];
}

type Result = (lookupX: number) => PointData;

function usePointDataEvaluator(options: Options): Result {
    return React.useCallback((lookupX: number) => {
        const xCoordinates = options.xCoordinatesAndValues.map(([coordinate]) => coordinate);
        const nextCoordinateIndex = xCoordinates.findIndex((x) => x >= lookupX);
        const nextPointCoordinate = xCoordinates[nextCoordinateIndex];
        const [startCoordinate, endCoordinate] = options.borders;
        const distanceToNextPoint = nextPointCoordinate > endCoordinate ?
            Infinity :
            Math.abs(nextPointCoordinate - lookupX);
        const prevPointCoordinate = xCoordinates[nextCoordinateIndex - 1];
        const distanceToPrevPoint = prevPointCoordinate < startCoordinate ?
            Infinity :
            Math.abs(prevPointCoordinate - lookupX);
        const matchIndex = distanceToPrevPoint < distanceToNextPoint ? nextCoordinateIndex - 1 : nextCoordinateIndex;
        const [xCoordinate, xValue] = options.xCoordinatesAndValues[matchIndex];
        const result: PointData = [
            {
                coordinate: xCoordinate,
                value: xValue
            },
            options.lines.map((line, index) => ({
                ...options.yDatas[index],
                coordinate: line[matchIndex][1],
                value: options.yValuesSet[index][matchIndex]
            }))
        ];
        return result;
    }, [options.xCoordinatesAndValues, options.yValuesSet, options.lines, options.borders, options.yDatas]);
}

export default usePointDataEvaluator;
