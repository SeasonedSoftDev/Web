import React from 'react';

export type TAddCampaignsModalProps = React.HTMLAttributes<HTMLDivElement> & {
  onClose: () => void;
  refresh: () => void;
};

export type TCampaignPhoto = {
  url: string;
  type: string;
  name: string;
  id: number;
  presignedUrl?: string;
};
