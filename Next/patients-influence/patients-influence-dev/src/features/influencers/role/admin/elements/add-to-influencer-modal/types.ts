import React from 'react';

export type TAddToInfluencersModalProps =
  React.HTMLAttributes<HTMLDivElement> & {
    onClose: () => void;
    checkedInfluencers: number[];
    setCheckedInfluencers: React.Dispatch<React.SetStateAction<number[]>>;
  };
