import { IPaginatedClients } from 'api/client/types';
import React from 'react';

export type TClientsProfileModalProps = React.HTMLAttributes<HTMLDivElement> & {
  clientUserId: number;
  onClose: () => void;
  clientData: IPaginatedClients;
  reload: () => Promise<void>;
};
