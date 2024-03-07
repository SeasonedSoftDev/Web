import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { Stack } from 'components/system';
import { Button } from 'components/ui';

export const SearchPageMain = styled.div<{ theme?: Theme }>``;

export const SearchPageFilter = styled(Stack)<{ theme?: Theme }>`
  ${({ theme }) => `
        border-radius: 4px;
        border: 1px solid ${theme.palette.common.black}20;
        padding: ${theme.spacing(5)};
        align-items: flex-end;
    `}
`;

export const SearchPageFilterButton = styled(Button)`
  min-width: 160px;
`;

export const SearchPageContent = styled(Stack)`
  width: 100%;
`;
