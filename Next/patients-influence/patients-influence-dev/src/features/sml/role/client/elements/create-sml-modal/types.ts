import React from 'react';

export type TAddSmlModalProps = React.HTMLAttributes<HTMLDivElement> & {
  refresh: () => void;
  onClose: () => void;
  sml?: any;
};
