import React from 'react';

export type TPromptInfluencerModalProps =
  React.HTMLAttributes<HTMLDivElement> & {
    onClose: () => void;
    type?: 'approve' | 'delete';
    handleAction: () => Promise<void>;
    target?: 'sml';
    plural?: boolean;
  };
