import React from 'react';

export type TConfirmUpdateSuggestionModalProps =
  React.HTMLAttributes<HTMLDivElement> & {
    onClose: () => void;
  };
