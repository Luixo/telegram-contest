import React from 'react';
import styled from '@emotion/styled';
import Switch, {SwitchConfig} from './switch';

interface Props {
    values: SwitchConfig[];
    setActivated: (activated: boolean[]) => void;
}

const Wrapper = styled.div({
    display: 'flex',
    '& > *': {
        marginRight: 12
    }
});

const MultipleSwitchBox: React.FC<Props> = (props) => {
    const activated = props.values.map((value) => value.isOn);
    return (
        <Wrapper>
            {props.values.map((value, index) =>
                <Switch
                    key={value.text}
                    {...value}
                    onClick={() => {
                        props.setActivated([
                            ...activated.slice(0, index),
                            !activated[index],
                            ...activated.slice(index + 1)
                        ]);
                    }}
                />
            )}
        </Wrapper>
    );
};

export default MultipleSwitchBox;
