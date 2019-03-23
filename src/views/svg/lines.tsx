import React from 'react';
import Line from './line';
import {Point} from '../../types';

interface LinePointsData {
    text: string;
    color: string;
    isOn: boolean;
}

interface Props {
    linePointsSet: Point[][];
    linePointsSetData: LinePointsData[];
}

const Lines: React.FC<Props> = React.memo((props) => (
    <>
        {props.linePointsSet.map((linePoints, index) => {
            const linePointsData = props.linePointsSetData[index];
            return (
                <Line
                    key={linePointsData.text}
                    disabled={!linePointsData.isOn}
                    stroke={linePointsData.color}
                    width={2}
                    points={linePoints}
                />
            );
        })}
    </>
));

export default Lines;
export {LinePointsData};
