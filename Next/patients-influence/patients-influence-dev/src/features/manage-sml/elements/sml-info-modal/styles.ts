import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { Grid } from 'components/system';

export const SmlInfoModalMain = styled(Grid)`
  width: 100%;
`;

export const SMLInfoHeader = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    background: ${theme.palette.default.main};
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: ${theme.spacing(5)};
    border-radius: 6px;
    color: ${theme.palette.common.gray[10]};
    font-weight: 600;
  `}
`;

export const SMLInfoHeaderSpan = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
  
  `}
`;

export const SMLInfoBody = styled.div<{ theme?: Theme }>`
  width: 100%;
`;
export const SMLInfoContainer = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    display: grid;
    grid-template-columns: 1fr 1fr;
  `}
`;
