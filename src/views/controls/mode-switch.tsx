import React from 'react';
import styled from '@emotion/styled';
import {ThemeType} from '../../types';

interface Props {
    themeType: ThemeType;
    updateThemeType: (nextTheme: ThemeType) => void;
}

const Wrapper = styled.div({
    position: 'fixed',
    bottom: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
});
const SwitchBox = styled.div({
    cursor: 'pointer',
    padding: 20,
    fontSize: '150%'
});

const ModeSwitch: React.FC<Props> = ({themeType, updateThemeType}) => {
    React.useEffect(() => {
        localStorage.setItem('theme', themeType);
    }, [themeType]);
    return (
        <Wrapper>
            <SwitchBox onClick={() => updateThemeType(themeType === 'light' ? 'dark' : 'light')}>
                Switch to {themeType === 'light' ? 'night' : 'day'} mode
            </SwitchBox>
        </Wrapper>
    );
};

export default ModeSwitch;
