import styled from '@emotion/styled';
import { Alert, Theme } from '@mui/material';
import { SnackbarContent } from 'notistack';
import { TSnackbarVariant } from 'components/ui/snackbar/types';

export const SnackbarMain = styled(SnackbarContent)<{ theme?: Theme }>`
  min-width: auto !important;
`;

export const SnackbarElement = styled(Alert)<{
  theme?: Theme;
}>`
  ${({ theme }) => `
        box-shadow: ${theme.shadows[1]};
    `}
`;
