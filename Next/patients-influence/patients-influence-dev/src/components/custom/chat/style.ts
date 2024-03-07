import styled from '@emotion/styled';
import { Theme } from '@mui/material';

export const ChatMain = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
        width: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
    `}
`;

export const ChatMessages = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
        width: 100%;
        height: 100%;
        border: 1px solid ${theme.palette.default.main};
        border-top-left-radius: ${theme.spacing(5)};
        border-top-right-radius: ${theme.spacing(5)};
        min-height: 250px;
        max-height: 250px;
        overflow-y: auto;
        padding: ${theme.spacing(7.5)} ${theme.spacing(2.5)};
        display: flex;
        flex-direction: column-reverse;
        gap: ${theme.spacing(5)};
    `}
`;

export const PingButton = styled.button<{ theme?: Theme }>`
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  color: #9f9fb0;
  text-decoration: none;
  font-size: inherit;
  position: absolute;
  top: 5px;
`;
