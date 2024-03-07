import React from 'react';

export type TAmbasadorProfileModalProps =
  React.HTMLAttributes<HTMLDivElement> & {
    onClose: () => void;
    ambassadorId: number;
  };
