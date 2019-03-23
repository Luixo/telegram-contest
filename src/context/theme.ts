import React from 'react';
import utils from '../utils/utils';
import {ThemeType, Theme} from '../types';

const THEMES: Record<ThemeType, Theme> = {
    light: {
        background: 'white',
        color: '#171717',
        switch: {
            borderColor: '#ccc'
        },
        thumb: {
            shadowBackground: '#e9f2f6',
            shadowOpacity: 0.7,
            controlBackground: '#4287b8',
            frameBorder: '#c8dcdf'
        },
        grid: {
            lineStroke: 'rgba(1, 1, 1, 0.1)',
            textColor: 'rgba(1, 1, 1, 0.5)'
        },
        popup: {
            shadowColor: 'rgba(1, 1, 1, 0.3)'
        }
    },
    dark: {
        background: '#242f3d',
        color: 'white',
        switch: {
            borderColor: '#354657'
        },
        thumb: {
            shadowBackground: '#e9f2f6',
            shadowOpacity: 0.2,
            controlBackground: '#4287b8',
            frameBorder: '#2e4a60'
        },
        grid: {
            lineStroke: 'rgba(255, 255, 255, 0.2)',
            textColor: 'rgba(255, 255, 255, 0.3)'
        },
        popup: {
            shadowColor: 'rgba(255, 255, 255, 0.3)'
        }
    }
};

const ThemeContext = React.createContext<Theme>(THEMES[utils.getSavedTheme()]);

export {ThemeContext, THEMES};
