import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { Grid } from 'components/system';

export const AddSuggestionModalMain = styled(Grid)<{ theme?: Theme }>`
  ${({ theme }) => `
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;

    ${theme.breakpoints.down('sm')} {
      grid-template-columns: 1fr;
    }
  `}
`;
