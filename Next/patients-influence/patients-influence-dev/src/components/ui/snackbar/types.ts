import { SnackbarKey, SnackbarMessage } from 'notistack';

export type TSnackbarVariant = 'success' | 'error' | 'info' | 'warning';

export type TSnackbarProps = {
  snackbarId: SnackbarKey;
  message: SnackbarMessage;
  variant?: TSnackbarVariant;
};
