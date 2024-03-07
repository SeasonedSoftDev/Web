import React from 'react';

export type TContactAmbassadorsModalProps =
  React.HTMLAttributes<HTMLDivElement> & {
    onClose: () => void;
  };
