import React from 'react';

function useAnimatedNumber(initialValue: number, ms: number): [number, (nextValue: number) => void] {
    const [value, setValue] = React.useState(initialValue);
    const rafId = React.useRef(0);
    React.useEffect(() => {
        return () => {
            window.cancelAnimationFrame(rafId.current);
        }
    }, []);
    const setAnimatedValue = (nextValue: number) => {
        window.cancelAnimationFrame(rafId.current);
        let startTimestamp = 0;
        const delta = nextValue - value;
        const startPosition = value;
        let currentPosition = 0;
        function animate(timestamp: number) {
            startTimestamp = startTimestamp || timestamp;
            const progress = timestamp - startTimestamp;
            const percent = (progress >= ms ? 1 : ease(progress / ms));
            currentPosition = startPosition + delta * percent;
            setValue(currentPosition);
            if (percent < 1) {
                rafId.current = window.requestAnimationFrame(animate);
            } else {
                setValue(nextValue);
            }
        }
        rafId.current = window.requestAnimationFrame(animate);
    };
    
    return [value, setAnimatedValue];
}

function ease(t: number): number {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

export default useAnimatedNumber;
