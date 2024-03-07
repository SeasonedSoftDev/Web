import React from 'react';

export type TScheduleInfluencerModalProps =
  React.HTMLAttributes<HTMLDivElement> & {
    onClose: () => void;
  };
