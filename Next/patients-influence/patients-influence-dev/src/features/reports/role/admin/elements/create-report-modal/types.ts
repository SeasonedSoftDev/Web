import React from 'react';

export type TAddReportModalProps = React.HTMLAttributes<HTMLDivElement> & {
  campaign?: {
    value: number;
    label: string;
  };
  refresh: () => void;
  onClose: () => void;
};
