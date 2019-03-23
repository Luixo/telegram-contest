import React from 'react';
import styled from '@emotion/styled';
import utils from '../utils/utils';
import {ThemeContext} from '../context/theme';
import {PointData} from '../types';

interface Props {
    data: PointData;
    isTop: boolean;
    width: number;
}

const VERTICAL_OFFSET = 20;
const HORIZONTAL_OFFSET = 40;
const HORIZONTAL_THRESHOLD = 10;

const Wrapper = styled.div<
    {isTop: boolean, left: number, background: string, shadowColor: string}
>(({background, isTop, left, shadowColor}) => ({
    background,
    position: 'absolute',
    zIndex: 100,
    [isTop ? 'top' : 'bottom']: VERTICAL_OFFSET,
    left,
    borderRadius: 6,
    boxShadow: `0 0 3px ${shadowColor}`,
    padding: 8,
    transition: 'left .1s ease-in'
}));

const Title = styled.div({});

const LineData = styled.div<{color: string}>(({color}) => ({
    fontSize: 16,
    color
}));
const LineDatas = styled.div({
    display: 'flex',
    marginTop: 12,
    '& > *:not(:last-child)': {
        marginRight: 8
    }
});
const LineValue = styled.div({
    fontSize: 20,
    fontWeight: 'bold'
});
const LineTitle = styled.div({
    fontSize: 14
});

const PointDataPopup: React.FC<Props> = (props) => {
    const [xData, yDatas] = props.data;
    const [selfWidth, setSelfWidth] = React.useState(0);
    const {background, popup} = React.useContext(ThemeContext);
    const ref = React.useRef<HTMLDivElement | null>(null);
    React.useEffect(() => {
        if (ref.current) {
            setSelfWidth(ref.current.offsetWidth);
        }
    }, [ref.current]);
    let left = xData.coordinate - HORIZONTAL_OFFSET;
    if (left < HORIZONTAL_THRESHOLD) {
        left = HORIZONTAL_THRESHOLD;
    } else if (left > props.width - selfWidth - HORIZONTAL_THRESHOLD) {
        left = props.width - selfWidth - HORIZONTAL_THRESHOLD;
    }
    return (
        <Wrapper isTop={props.isTop} left={left} background={background} shadowColor={popup.shadowColor} ref={ref}>
            <Title>{utils.prettyDate(xData.value)}</Title>
            <LineDatas>
                {yDatas.map((yData) =>
                    <LineData key={yData.text} color={yData.color}>
                        <LineValue>{utils.prettyNumber(yData.value)}</LineValue>
                        <LineTitle>{yData.text}</LineTitle>
                    </LineData>
                )}
            </LineDatas>
        </Wrapper>
    );
};

export default PointDataPopup;
