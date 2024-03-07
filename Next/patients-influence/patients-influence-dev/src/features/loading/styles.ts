import styled from '@emotion/styled';
import { Theme } from '@mui/material';

export const LoadingPageMain = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
        width: 100%;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: ${theme.spacing(5)};
    `}
`;
