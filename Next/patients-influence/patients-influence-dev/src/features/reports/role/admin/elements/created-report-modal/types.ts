import React from 'react';

export type TCreatedReportModalProps = React.HTMLAttributes<HTMLDivElement> & {
  data: any;
  onClose: () => void;
  reload: () => void;
};
