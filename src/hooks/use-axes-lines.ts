import React from 'react';
import {Point} from '../types';

interface Options {
    min: number;
    max: number;
    size: number;
    shift: number;
    counterSideSize: number;
    linesAmount: number;
}

type Result = [number, Point, Point];

function useAxesLines({min, max, size, shift, counterSideSize, linesAmount}: Options): Result[] {
    return React.useMemo(
        () => {
            const step = getClosestDenominator(max - min, linesAmount);
            const start = Math.round(min / step) * step;
            const actualLinesAmount = Math.ceil((max - min) / step);
            const lines = Array(actualLinesAmount).fill(null)
                    .map((_, index) => start + step * index)
                    .filter((num) => num >= min && num <= max);
            const amplifier = size / (max - min);
            return lines
                .map((line) => size - (line - start) * amplifier + shift)
                .map<[number, Point, Point]>((line, index) => [
                    lines[index],
                    [0, line],
                    [counterSideSize, line]
                ])
        },
        [min, max, size, counterSideSize, shift, linesAmount]
    );
}

function getClosestDenominator(size: number, amount: number): number {
    const step = size / amount;
    return Number(step.toPrecision(1));
}

export default useAxesLines;
