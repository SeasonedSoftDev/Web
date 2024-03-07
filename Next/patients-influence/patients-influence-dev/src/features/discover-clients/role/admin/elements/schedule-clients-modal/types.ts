import React from 'react';

export type TScheduleClientsModalProps =
  React.HTMLAttributes<HTMLDivElement> & {
    onClose: () => void;
  };
