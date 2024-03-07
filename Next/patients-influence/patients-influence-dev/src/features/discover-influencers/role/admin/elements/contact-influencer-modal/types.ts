import React from 'react';

export type TContactInfluencerModalProps =
  React.HTMLAttributes<HTMLDivElement> & {
    onClose: () => void;
    id: string;
  };
