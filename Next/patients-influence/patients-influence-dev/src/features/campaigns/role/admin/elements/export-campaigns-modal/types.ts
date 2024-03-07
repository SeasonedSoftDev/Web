import React from 'react';

export type TExportCampaignsModalProps =
  React.HTMLAttributes<HTMLDivElement> & {
    onClose: () => void;
    checkedOCampaigns: number[];
    checkedIPCampaigns: number[];
    checkedFCampaigns: number[];
  };
