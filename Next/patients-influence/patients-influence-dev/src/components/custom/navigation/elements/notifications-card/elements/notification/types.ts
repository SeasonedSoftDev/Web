import React from 'react';

import { TNotificationStatus } from 'components/custom/notifications-card/types';

export type TNotificationProps = React.HTMLAttributes<HTMLDivElement> & {
  text: string;
  createdAt?: string;
  status: TNotificationStatus;
};
