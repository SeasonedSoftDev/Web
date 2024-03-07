import React from 'react';

export type TExportClientsModalProps = React.HTMLAttributes<HTMLDivElement> & {
  onClose: () => void;
  checkedRegClients: number[];
  checkedSchedClients: number[];
};
