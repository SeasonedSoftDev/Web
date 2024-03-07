import React from 'react';

export type TPromptInfluencerModalProps =
  React.HTMLAttributes<HTMLDivElement> & {
    onClose: () => void;
    type?: 'decline' | 'leave';
    handleAction: () => Promise<void>;
    target?: 'campaign';
    plural?: boolean;
  };
