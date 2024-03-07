import React from 'react';

export type TNotificationStatus = 'seen' | 'unseen';

export type TNotification = {
  id: string | number;
  text: string;
  createdAt?: string;
  status: TNotificationStatus;
};

export type TNotificationsCardProps = React.HTMLAttributes<HTMLDivElement> & {
  onClose: () => void;
};
