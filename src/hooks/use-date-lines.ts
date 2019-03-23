import React from 'react';
import utils from '../utils/utils';

interface Options {
    width: number;
    firstDate: [number, number];
    lastDate: [number, number];
}

interface LineValue {
    value: string;
    coordinate: number;
}
const LABEL_WIDTH = 50;

function useDateLines(options: Options): LineValue[] {
    return React.useMemo(() => {
        if (!options.firstDate || !options.lastDate || options.firstDate[1] === options.lastDate[1]) {
            return [];
        }
        const [firstCoordinate, firstValue] = options.firstDate;
        const [lastCoordinate, lastValue] = options.lastDate;
        function mapDateToCoordinate(date: number): number {
            const amplifier = (date - firstValue) / (lastValue - firstValue);
            return Math.floor(amplifier * (lastCoordinate - firstCoordinate) + firstCoordinate);
        }
        function mapCoordinateToDate(coordinate: number): number {
            const amplifier = (coordinate - firstCoordinate) / (lastCoordinate - firstCoordinate);
            return Math.floor(amplifier * (lastValue - firstValue) + firstValue);
        }
        const amountOfLabels = Math.max(0, Math.floor((options.width - LABEL_WIDTH * 2) / LABEL_WIDTH));
        const startDate = mapCoordinateToDate(LABEL_WIDTH / 2);
        const endDate = mapCoordinateToDate(options.width - (LABEL_WIDTH / 2));
        const step = (endDate - startDate) / amountOfLabels;
        const dates = Array(amountOfLabels + 1).fill(null).map((_, index) => startDate + step * index);
        const withTime = dates.reduce<Set<string>>((memo, date) => {
            const formatted = new Date(date);
            memo.add(formatted.getMonth() + ',' + formatted.getDate());
            return memo;
        }, new Set()).size !== dates.length;
        return dates.map((date) => ({
            value: utils.prettyDate(date, withTime),
            coordinate: mapDateToCoordinate(date)
        }))
    }, [options.width, options.firstDate, options.lastDate]);
}

export default useDateLines;
