import React from 'react';
import styled from '@emotion/styled';

const Wrapper = styled.a({
    position: 'fixed',
    bottom: 0,
    right: 0,
    padding: 12
});

const Disclaimer: React.FC<{}> = () => (
    <Wrapper href="https://github.com/Luixo/telegram-contest" target="_blank">
        Source code
    </Wrapper>
);

export default Disclaimer;
