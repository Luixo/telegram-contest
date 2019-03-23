import {ThemeType} from '../types';

const NUMBER_POSTFIXES = ['K', 'M', 'B', 'T', 'Q'];

const utils = {
    prettyNumber: (value: number): string => {
        if (value < 10 ** 3) {
            return value.toFixed(0);
        }
        let postfixIndex = -1;
        while (value >= 10 ** 3 && NUMBER_POSTFIXES
[postfixIndex + 1]) {
            postfixIndex++;
            value = value / 10 ** 3;
        }
        return value.toFixed(value < 10 ? 1 : 0) + NUMBER_POSTFIXES
[postfixIndex];
    },
    
    prettyDate: (value: number, withTime?: boolean): string => {
        const date = new Date(value);
        if (withTime) {
            return date.toLocaleTimeString('en-US', {
                day: 'numeric', month: 'short', hour: '2-digit'
            });
        }
        return date.toLocaleDateString('en-US', {day: 'numeric', month: 'short'});
    },
    
    getSavedTheme: (): ThemeType => {
        const maybeSavedTheme = localStorage.getItem('theme');
        return maybeSavedTheme && ['light', 'dark'].includes(maybeSavedTheme) ?
            maybeSavedTheme as ThemeType :
            'light';
    }
};

export default utils;
