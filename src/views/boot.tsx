import React from 'react';
import styled from '@emotion/styled';
import {Global} from '@emotion/core';
import globalReset from '../utils/global-reset';
import utils from '../utils/utils';
import {ThemeContext, THEMES} from '../context/theme';
import useWindowSize from '../hooks/use-window-size';
import useChartData from '../hooks/use-chart-data';
import ChartWrapper from './chart-wrapper';
import ModeSwitch from './controls/mode-switch';
import Disclaimer from './disclaimer';

const Body = styled.div({
    width: '100%',
    height: '100%',
    display: 'flex'
});

const Boot: React.FC<{}> = () => {
    const [themeType, setThemeType] = React.useState(utils.getSavedTheme());
    const charts = useChartData();
    const theme = THEMES[themeType];
    const chartsRe = window.location.search.match(/amount=(\d+)/);
    const chartsAmount = chartsRe ? Math.min(Number(chartsRe[1]), charts.length) : charts.length;
    const {innerWidth} = useWindowSize();
    const chartWidth = innerWidth / chartsAmount;
    return (
        <ThemeContext.Provider value={theme}>
            <div style={{background: theme.background, color: theme.color}}>
                <Global styles={globalReset} />
                <Body>
                    {charts.slice(0, chartsAmount).map((chart, index) => (
                        <ChartWrapper
                            key={index}
                            title={`Chart #${index}`}
                            chart={chart}
                            width={chartWidth}
                        />
                    ))}
                </Body>
                <ModeSwitch themeType={themeType} updateThemeType={setThemeType} />
                <Disclaimer />
            </div>
        </ThemeContext.Provider>
    );
};

export default Boot;
