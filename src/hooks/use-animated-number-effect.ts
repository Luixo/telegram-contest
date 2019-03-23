import React from 'react';
import useAnimatedNumber from './use-animated-number';

function useAnimatedNumberEffect(resolve: () => number, deps: React.DependencyList, ms: number): number {
    const [value, setAnimatedValue] = useAnimatedNumber(resolve(), ms);
    React.useEffect(() => {
        const nextValue = resolve();
        if (isNaN(nextValue) || nextValue === Infinity || nextValue === -Infinity) {
            return;
        }
        setAnimatedValue(nextValue);
    }, deps);
    return value;
}

export default useAnimatedNumberEffect;
