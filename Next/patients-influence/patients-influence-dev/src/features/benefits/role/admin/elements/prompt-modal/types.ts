import React from 'react';

export type TPromptInfluencerModalProps =
  React.HTMLAttributes<HTMLDivElement> & {
    onClose: () => void;
    type?: 'approve' | 'delete' | 'start';
    handleAction: () => Promise<void>;
    target?: 'suggestion' | 'benefit';
    plural?: boolean;
  };
