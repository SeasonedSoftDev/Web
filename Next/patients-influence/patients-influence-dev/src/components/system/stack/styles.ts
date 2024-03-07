import styled from '@emotion/styled';
import { Theme } from '@mui/material';

export const StackMain = styled.div<{
  theme?: Theme;
  direction: 'vertical' | 'horizontal';
}>`
  ${({ theme, direction }) => `
        width: 100%;
        display: flex;
        flex-direction: ${direction === 'horizontal' ? 'row' : 'column'};
        gap: ${theme.spacing(5)};
        width: 100%;
    `}
`;
