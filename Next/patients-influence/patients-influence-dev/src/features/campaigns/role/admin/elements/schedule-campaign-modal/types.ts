import React from 'react';

export type TScheduleCampaignModalProps =
  React.HTMLAttributes<HTMLDivElement> & {
    onClose: () => void;
  };
