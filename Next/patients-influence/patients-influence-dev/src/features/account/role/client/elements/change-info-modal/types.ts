import React from 'react';

export type TChangeInfoModalProps = React.HTMLAttributes<HTMLDivElement> & {
  onClose: () => void;
  data: any;
  refresh: () => void;
};
