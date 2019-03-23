import React from 'react';
import styled from '@emotion/styled';

interface Props {
    width: number;
    height: number;
}

const Wrapper = styled.div<{width: number, height: number}>(({width, height}) => ({
    fontSize: Math.min(width, height) * 0.1,
    width,
    height,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}));

const Error: React.FC<Props> = (props) => (
    <Wrapper width={props.width} height={props.height}>
        There is nothing here :(
    </Wrapper>
);

export default Error;
