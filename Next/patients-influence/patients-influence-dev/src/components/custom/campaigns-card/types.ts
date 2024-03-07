import React from 'react';

export type TCampaignsCardProps = React.HTMLAttributes<HTMLDivElement> & {
  company: string;
  app: string;
  image?: string;
};
