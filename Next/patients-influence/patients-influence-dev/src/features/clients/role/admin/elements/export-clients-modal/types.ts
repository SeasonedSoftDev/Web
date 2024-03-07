import React from 'react';

export type TExportClientsModalProps = React.HTMLAttributes<HTMLDivElement> & {
  onClose: () => void;
  checkedClients: number[];
};
