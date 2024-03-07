import React from 'react';

export type TMaintenanceModalProps = React.HTMLAttributes<HTMLDivElement> & {
  onClose: () => void;
  affiliateLink: string;
};
