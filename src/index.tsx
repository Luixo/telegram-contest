import * as React from 'react';
import * as ReactDom from 'react-dom';
import Boot from './views/boot';

window.addEventListener('load', () => {
    ReactDom.render(
        <Boot />,
        document.querySelector('#app')
    );
});
