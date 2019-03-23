interface RawChartData {
    values: number[];
}

interface YChartData extends RawChartData {
    color: string;
    name: string;
}

interface FullChartData {
    x: RawChartData;
    ys: YChartData[];
}

type Point = [number, number];

type ThemeType = 'light' | 'dark';

interface Theme {
    background: string;
    color: string;
    switch: {
        borderColor: string;
    };
    thumb: {
        shadowBackground: string;
        shadowOpacity: number;
        controlBackground: string;
        frameBorder: string;
    };
    grid: {
        lineStroke: string;
        textColor: string;
    };
    popup: {
        shadowColor: string;
    }
}

interface ChartOptions {
    outerWidth: number;
    outerHeight: number;
    innerWidth: number;
    innerHeight: number;
    verticalMargin: number;
    horizontalMargin: number;
}

interface XData {
    coordinate: number;
    value: number;
}

interface YData extends XData {
    text: string;
    color: string;
    isOn: boolean;
}

type PointData = [XData, YData[]];

export {
    FullChartData, Point, YChartData,
    ThemeType, Theme, ChartOptions, PointData
};
