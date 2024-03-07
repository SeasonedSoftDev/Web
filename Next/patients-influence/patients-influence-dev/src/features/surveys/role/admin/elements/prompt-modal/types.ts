import React from 'react';

export type TPromptInfluencerModalProps =
  React.HTMLAttributes<HTMLDivElement> & {
    onClose: () => void;
    type?: 'approve' | 'delete' | 'start' | 'finish';
    handleAction: () => Promise<void>;
    target?: 'survey';
    plural?: boolean;
  };
