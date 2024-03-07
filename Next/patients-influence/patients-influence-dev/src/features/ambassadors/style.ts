import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { Stack } from 'components/system';

export const AmbassadorsPageMain = styled(Stack)`
  width: 100%;
`;

export const AmbassadorsPageCharts = styled.div<{ theme?: Theme }>`
  overflow-x: auto;
  padding-bottom: 10px;

  ${({ theme }) => `
        display: flex;
        gap: ${theme.spacing(5)};
        width: 100%;
    `}
`;

export const AmbassadorsPageFilter = styled(Stack)<{ theme?: Theme }>`
  ${({ theme }) => `
        border-radius: 4px;
        border: 1px solid ${theme.palette.common.black}20;
        padding: ${theme.spacing(5)};
    `}
`;

export const AmbassadorsPageFilterActions = styled(Stack)<{
  theme?: Theme;
}>`
  justify-content: flex-end;
  & > * {
    min-width: 100px;
  }
`;
