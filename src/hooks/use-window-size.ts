import React from 'react';

interface WindowSize {
    innerHeight: number;
    innerWidth: number
    outerHeight: number;
    outerWidth: number;
}

function getSize(): WindowSize {
    return {
        innerHeight: window.innerHeight,
        innerWidth: window.innerWidth,
        outerHeight: window.outerHeight,
        outerWidth: window.outerWidth,
    };
}

function useWindowSize(): WindowSize {
    let [windowSize, setWindowSize] = React.useState<WindowSize>(getSize());
    
    function handleResize() {
        setWindowSize(getSize());
    }
    
    React.useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    
    return windowSize;
}

export default useWindowSize;
