import React from 'react';

export type TAddReportModalProps = React.HTMLAttributes<HTMLDivElement> & {
  data: any;
  onClose: () => void;
};
