import React from 'react';

export type TClientsProfileModalProps = React.HTMLAttributes<HTMLDivElement> & {
  onClose: () => void;
  clientUserId: number;
  reload: () => Promise<void>;
};
