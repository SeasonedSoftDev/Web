import React from 'react';

export type TPromptInfluencerModalProps =
  React.HTMLAttributes<HTMLDivElement> & {
    onClose: () => void;
    type?: 'decline' | 'approve' | 'invite' | 'delete' | 'match';
    handleAction: () => Promise<void>;
    target?: 'influencer';
    plural?: boolean;
  };
