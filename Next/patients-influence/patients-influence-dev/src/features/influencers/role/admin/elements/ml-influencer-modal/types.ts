import React from 'react';

export type TMlInfluencersModalProps = React.HTMLAttributes<HTMLDivElement> & {
  onClose: () => void;
  checkedInfluencers: number[];
};
