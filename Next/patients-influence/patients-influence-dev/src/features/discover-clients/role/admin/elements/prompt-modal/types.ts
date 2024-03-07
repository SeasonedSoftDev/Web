import React from 'react';

export type TPromptInfluencerModalProps =
  React.HTMLAttributes<HTMLDivElement> & {
    onClose: () => void;
    type?: 'approve' | 'delete';
    handleAction: () => Promise<void>;
    target?: 'influencer' | 'client' | 'ambassador';
    plural?: boolean;
  };
