import React from 'react';

export type TClientListAmbassadorModalProps =
  React.HTMLAttributes<HTMLDivElement> & {
    onClose: () => void;
  };
