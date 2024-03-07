import styled from '@emotion/styled';
import { Theme } from '@mui/material';

export const HighlightedTextMain = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    display: inline-block;
    span {
        background-color: ${theme.palette.secondary.main}20;
        color: ${theme.palette.secondary.main};
    }
  `}
`;
