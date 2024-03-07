import React from 'react';

export type TDeleteInfluencerModalProps =
  React.HTMLAttributes<HTMLDivElement> & {
    onClose: () => void;
    id: any;
  };
