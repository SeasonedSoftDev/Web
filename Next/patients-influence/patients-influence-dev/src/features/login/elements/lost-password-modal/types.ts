import React from 'react';

export type TLostPasswordModalProps = React.HTMLAttributes<HTMLDivElement> & {
  onClose: () => void;
};
