import React from 'react';

export type TAddSmlModalProps = React.HTMLAttributes<HTMLDivElement> & {
  data?: any;
  refresh: () => void;
  onClose: () => void;
};
