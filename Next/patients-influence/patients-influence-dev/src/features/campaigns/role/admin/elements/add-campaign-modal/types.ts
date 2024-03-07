import React from 'react';

export type TAddCampaignModalProps = React.HTMLAttributes<HTMLDivElement> & {
  onClose: () => void;
  refresh: () => void;
};
