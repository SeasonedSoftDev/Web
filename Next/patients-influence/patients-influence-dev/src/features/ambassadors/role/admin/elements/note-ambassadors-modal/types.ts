import React from 'react';

export type TNoteAmbassadorsModalProps =
  React.HTMLAttributes<HTMLDivElement> & {
    onClose: () => void;
  };
