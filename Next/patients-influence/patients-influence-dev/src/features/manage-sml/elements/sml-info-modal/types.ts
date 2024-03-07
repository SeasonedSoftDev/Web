import React from 'react';

export type TSmlInfoModalProps = React.HTMLAttributes<HTMLDivElement> & {
  onClose: () => void;
  info?: Array<{
    frequency: string;
    word: string;
  }>;
};
