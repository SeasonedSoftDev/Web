import React from 'react';

export type TCreatedSmlModalProps = React.HTMLAttributes<HTMLDivElement> & {
  data?: any;
  refresh: () => void;
  onClose: () => void;
};
