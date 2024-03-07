import React from 'react';

export type TConfirmRegistrationModalProps =
  React.HTMLAttributes<HTMLDivElement> & {
    onClose: () => void;
    email: string;
    count: number;
  };
