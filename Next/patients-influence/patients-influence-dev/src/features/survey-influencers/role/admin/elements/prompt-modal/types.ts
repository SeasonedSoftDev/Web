import React from 'react';

export type TPromptInfluencerModalProps =
  React.HTMLAttributes<HTMLDivElement> & {
    onClose: () => void;
    type?: 'invite' | 'delete';
    handleAction: () => Promise<void>;
    target?: 'influencer';
    plural?: boolean;
  };
