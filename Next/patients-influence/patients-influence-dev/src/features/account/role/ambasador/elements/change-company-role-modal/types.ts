import React from 'react';

export type TChangeAmbassadorInfoModalProps =
  React.HTMLAttributes<HTMLDivElement> & {
    onClose: () => void;
    data: any;
    setParentFilter?: React.Dispatch<any>;
    setCompanyRole?: React.Dispatch<any>;
  };
