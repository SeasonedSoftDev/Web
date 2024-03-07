import React from 'react';

export type TPromptInfluencerModalProps =
  React.HTMLAttributes<HTMLDivElement> & {
    onClose: () => void;
    type?: 'invite' | 'approve' | 'decline' | 'delete';
    handleAction: () => Promise<void>;
    target?: 'influencer' | 'submission';
    plural?: boolean;
  };
