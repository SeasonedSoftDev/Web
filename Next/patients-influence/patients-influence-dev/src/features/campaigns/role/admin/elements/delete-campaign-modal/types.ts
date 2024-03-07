import React from 'react';

export type TDeleteCampaignModalProps = React.HTMLAttributes<HTMLDivElement> & {
  onClose: () => void;
  id: any;
  reload: () => void;
};
