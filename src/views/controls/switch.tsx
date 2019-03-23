import React from 'react';
import styled from '@emotion/styled';
import {ThemeContext} from '../../context/theme';

interface SwitchConfig {
    color: string;
    isOn: boolean;
    text?: string;
}

interface Props extends SwitchConfig {
    onClick: () => void;
}

const BUTTON_SIZE = 22;
const PADDING_SIZE = 6;

const Wrapper = styled.div<{borderColor: string}>(({borderColor}) => ({
    height: BUTTON_SIZE + PADDING_SIZE * 2,
    padding: `0 ${PADDING_SIZE}px`,
    borderRadius: BUTTON_SIZE + PADDING_SIZE * 2,
    display: 'flex',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor,
    boxSizing: 'border-box',
    width: 'fit-content',
    cursor: 'pointer'
}));

const Text = styled.span({
    fontSize: 16,
    lineHeight: '20px',
    margin: '0 8px'
});

const Button = styled.div<{isOn: boolean, color: string}>(({color, isOn}) => ({
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: '50%',
    border: `2px solid ${color}`,
    boxSizing: 'border-box',
    background: isOn ? color : 'transparent'
}));

const Switch: React.FC<Props> = (props) => {
    const theme = React.useContext(ThemeContext);
    return (
        <Wrapper borderColor={theme.switch.borderColor} color={props.color} onClick={props.onClick}>
            <Button isOn={props.isOn} color={props.color} />
            {props.text ? <Text>{props.text}</Text> : null}
        </Wrapper>
    );
};

export default Switch;
export {SwitchConfig};
