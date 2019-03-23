import React from 'react';
import styled from '@emotion/styled';
import {ThemeContext} from '../../context/theme';

interface Props {
    left: number; // 0 - 100
    right: number; // 0 - 100
    height: number;
    width: number;
    onChangeLeft: (left: number) => void;
    onChangeRight: (right: number) => void;
}

const CONTROL_WIDTH = 6;

const MIN_WINDOW_SIZE = 5; // %

const Wrapper = styled.div({
    position: 'relative',
    overflow: 'hidden'
});

const Window = styled.div<{height: number, width: number}>(({height, width}) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    height,
    width,
    overflow: 'hidden'
}));

const Control = styled.div<{background: string}>(({background}) => ({
    position: 'absolute',
    cursor: 'ew-resize',
    top: 0,
    width: CONTROL_WIDTH,
    height: '100%',
    background,
    opacity: 0.3
}));

const Shadow = styled.div<
    {left: string, width: string, background: string, opacity: number}
>(({left, width, background, opacity}) => ({
    position: 'absolute',
    height: '100%',
    left,
    width,
    background,
    opacity
}));

const Frame = styled.div<{left: string, width: string, borderColor: string}>(({left, width, borderColor}) => ({
    position: 'absolute',
    cursor: 'pointer',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor,
    borderLeftStyle: 'none',
    borderRightStyle: 'none',
    boxSizing: 'border-box',
    height: '100%',
    left,
    width
}));

const ThumbWindow: React.FC<Props> = React.memo((props) => {
    const ref = React.useRef<HTMLDivElement | null>(null);
    const [drag, setDrag] = React.useState<[number, (num: number) => void]>();
    React.useEffect(() => {
        const onDragEnd = () => {
            setDrag(undefined);
        };
        const onDrag = (e: MouseEvent) => {
            if (drag !== undefined) {
                const [startPixel, setPercent] = drag;
                const deltaPixel = e.clientX - startPixel;
                const deltaPercent = (deltaPixel / props.width) * 100;
                setPercent(deltaPercent);
            }
        };
        if (drag) {
            window.addEventListener('mousemove', onDrag, {passive: true});
            window.addEventListener('mouseup', onDragEnd, {passive: true});
        }
        return () => {
            window.removeEventListener('mousemove', onDrag);
            window.removeEventListener('mouseup', onDragEnd);
        }
    }, drag ? [drag[0], drag[1]] : [0, 0]);
    const {thumb} = React.useContext(ThemeContext);
    return (
        <Wrapper ref={ref}>
            {props.children}
            <Window height={props.height} width={props.width}>
                {props.left > 0 ?
                    <Shadow
                        opacity={thumb.shadowOpacity}
                        background={thumb.shadowBackground}
                        left="0"
                        width={`calc(${props.left}% - ${CONTROL_WIDTH / 2}px)`}
                    /> :
                    null
                }
                {props.right < 100 ?
                    <Shadow
                        opacity={thumb.shadowOpacity}
                        background={thumb.shadowBackground}
                        left={`calc(${props.right}% + ${CONTROL_WIDTH / 2}px)`}
                        width={`calc(${100 - props.right}% - ${CONTROL_WIDTH / 2}px)`}
                    /> :
                    null
                }
                <Frame
                    left={`calc(${props.left}% - ${CONTROL_WIDTH / 2}px)`}
                    width={`calc(${props.right - props.left}% + ${CONTROL_WIDTH}px)`}
                    borderColor={thumb.frameBorder}
                    onMouseDown={(e) => {
                        const startLeft = props.left;
                        const startRight = props.right;
                        setDrag([
                            e.clientX,
                            (delta) => {
                                const frameWidth = startRight - startLeft;
                                props.onChangeLeft(between(0, startLeft + delta, 100 - frameWidth));
                                props.onChangeRight(between(frameWidth, startRight + delta, 100));
                            }
                        ]);
                    }}
                >
                    <Control
                        background={thumb.controlBackground}
                        style={{left: 0}}
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            const startLeft = props.left;
                            const startRight = props.right;
                            setDrag([
                                e.clientX,
                                (delta) => props.onChangeLeft(between(0, startLeft + delta, startRight - MIN_WINDOW_SIZE))
                            ]);
                        }}
                    />
                    <Control
                        background={thumb.controlBackground}
                        style={{right: 0}}
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            const startLeft = props.left;
                            const startRight = props.right;
                            setDrag([
                                e.clientX,
                                (delta) => props.onChangeRight(between(startLeft + MIN_WINDOW_SIZE, startRight + delta, 100))
                            ]);
                        }}
                    />
                </Frame>
            </Window>
        </Wrapper>
    );
});

function between(min: number, value: number, max: number): number {
    return Math.min(Math.max(min, value), max);
}

export default ThumbWindow;
