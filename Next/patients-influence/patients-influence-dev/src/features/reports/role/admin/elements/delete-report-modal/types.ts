import React from 'react';

export type TDeleteReportModalProps = React.HTMLAttributes<HTMLDivElement> & {
  onClose: () => void;
  id: any;
  reload: () => void;
};
