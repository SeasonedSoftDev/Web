import { keyframes } from '@emotion/css';
import { Theme } from '@mui/material';
import styled from '@emotion/styled';

const rotateAnimation = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

export const LoaderMain = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    width: 56px;
    height: 56px;
    display: grid;
    border-width: 4.5px;
    border-style: solid;
    border-radius: 50%;
    border-color: ${theme.palette.common.gray[2]} #0000;
    animation: ${rotateAnimation} 1s infinite linear;
    &::before,
    &::after {
        content: "";
        grid-area: 1/1;
        margin: 2.2px;
        border: inherit;
        border-radius: 50%;
    }

    &::before {
        border-color: ${theme.palette.primary.main} #0000;
        animation: inherit;
        animation-duration: 0.5s;
        animation-direction: reverse;
    }
    &::after {
        margin: 8.9px;
    }
  `}
`;
