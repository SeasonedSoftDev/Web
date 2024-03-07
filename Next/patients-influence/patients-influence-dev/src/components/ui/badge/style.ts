import styled from '@emotion/styled';
import { Theme } from '@mui/material';

export const BadgeMain = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    height: 20px;
    min-width: 20px;
    padding: 0 ${theme.spacing(0.125)};
    font-size: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: ${theme.palette.primary.main};
    color: white;
    border-radius: 10px;
 `}
`;
