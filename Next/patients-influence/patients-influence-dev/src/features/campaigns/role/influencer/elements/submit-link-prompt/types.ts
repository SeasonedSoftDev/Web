import React from 'react';

export type TPromptInfluencerModalProps =
  React.HTMLAttributes<HTMLDivElement> & {
    onClose: () => void;
    type?: 'submit';
    handleAction: () => Promise<void>;
    target?: 'link';
    plural?: boolean;
  };
