import React from 'react';

export type TSearchProps = React.HTMLAttributes<HTMLDivElement> & {
  value?: string;
  onValue?: (v: string) => void;
  onEnter?: () => void;
};
