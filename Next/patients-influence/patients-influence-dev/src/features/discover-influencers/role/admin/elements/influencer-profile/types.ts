import React from 'react';

export type TInfluencerProfileModalProps =
  React.HTMLAttributes<HTMLDivElement> & {
    onClose: () => void;
    influencerId: number;
  };

export type TPostTypeResult = { name: string; value: number };
export type TSelectFieldType = { label: string; value: number };
