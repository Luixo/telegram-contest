import React from 'react';
import styled from '@emotion/styled';
import useAnimatedNumberEffect from '../../hooks/use-animated-number-effect';
import {Point} from '../../types';

interface Props {
    points: Point[];
    disabled?: boolean;
    legend?: string;
    stroke: string;
    width?: number;
}

const OPACITY_ANIMATION = 100;

const Path = styled.path<{opacity: number}>((props) => props);

const Line: React.FC<Props> = React.memo((props) => {
    const opacity = useAnimatedNumberEffect(
        () => props.disabled ? 0 : 1,
        [props.disabled],
        OPACITY_ANIMATION
    );
    const [start, ...points] = props.points;
    const line = React.useMemo(
        () => points.reduce((memo, [x, y]) => memo + `${x}, ${y} `, `M ${start[0]},${start[1]} L`),
        [props.points]
    );
    return (
        <Path
            opacity={opacity}
            stroke={props.stroke}
            strokeLinecap="round"
            strokeWidth={props.width || 1}
            fill="none"
            d={line}
        />
    );
});

export default Line;
