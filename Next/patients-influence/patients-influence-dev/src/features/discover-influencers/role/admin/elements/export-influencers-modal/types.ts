import React from 'react';

export type TExportInfluencersModalProps =
  React.HTMLAttributes<HTMLDivElement> & {
    onClose: () => void;
    checkedRegInfluencers: number[];
    checkedToBeApprovedInfluencers: number[];
  };
