import React from 'react';

export type TAddSmlModalProps = React.HTMLAttributes<HTMLDivElement> & {
  sml?: any;
  refresh: () => void;
  onClose: () => void;
  data?: any;
};
