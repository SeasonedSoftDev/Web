import React from 'react';

export type TPromptInfluencerModalProps =
  React.HTMLAttributes<HTMLDivElement> & {
    onClose: () => void;
    type?: 'accept' | 'decline' | 'leave';
    handleAction: () => Promise<void>;
    target?: 'campaign' | 'survey';
  };
