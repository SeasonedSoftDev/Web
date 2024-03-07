import React from 'react';
import { Snackbar } from 'components/ui';
import { TSnackbarVariant } from 'components/ui/snackbar/types';
import { OptionsObject, useSnackbar as useNotistackSnackbar } from 'notistack';

const useSnackbar = () => {
  const { enqueueSnackbar } = useNotistackSnackbar();

  const push = (
    message: string,
    options?: OptionsObject & Partial<{ variant: TSnackbarVariant }>
  ) => {
    enqueueSnackbar(message, {
      ...options,
      content: (key) => {
        // destructure the options we need from the extended options
        // object, and provide a default case if we didn't provide any
        const { variant } = options || { variant: undefined };
        return (
          <Snackbar
            snackbarId={`${key}`}
            message={message}
            variant={variant || 'success'}
          />
        );
      },
    });
  };

  return { push };
};

export default useSnackbar;
