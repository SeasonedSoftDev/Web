import React from 'react';

export type TDeleteClientsModalProps = React.HTMLAttributes<HTMLDivElement> & {
  onClose: () => void;
  handleDelete?: () => Promise<void>;
};
