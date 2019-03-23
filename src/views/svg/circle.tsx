import React from 'react';
import {ThemeContext} from '../../context/theme';

interface Props {
    x: number;
    y: number;
    outlineColor: string;
}

const DEFAULT_RADIUS = 5;
const DEFAULT_OUTLINE_WIDTH = 2;

const Circle: React.FC<Props> = React.memo((props) => {
    const {background} = React.useContext(ThemeContext);
    return (
        <circle
            cx={props.x}
            cy={props.y}
            r={DEFAULT_RADIUS}
            fill={background}
            strokeWidth={DEFAULT_OUTLINE_WIDTH}
            stroke={props.outlineColor}
        />
    );
});

export default Circle;
