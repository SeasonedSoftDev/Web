import React from 'react';

export type TAddCampaignsModalProps = React.HTMLAttributes<HTMLDivElement> & {
  onClose: () => void;
  id: any;
  reload: () => void;
};
