import styled from '@emotion/styled';
import { Theme } from '@mui/material';

export const TitleMain = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
        color: ${theme.palette.primary.main};
        font-weight: 600;
    `}
`;
