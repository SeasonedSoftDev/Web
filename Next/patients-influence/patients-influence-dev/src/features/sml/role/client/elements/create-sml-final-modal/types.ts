import React from 'react';

export type TCreateSmlFinalProps = React.HTMLAttributes<HTMLDivElement> & {
  onClose: () => void;
  data: any;
};
