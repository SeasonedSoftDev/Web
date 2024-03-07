import React from 'react';

import {
  NotificationMain,
  NotificationContent,
  NotificationStatus,
  NotificationText,
  NotificationDate,
} from 'components/custom/notifications-card/elements/notification/styles';
import { TNotificationProps } from 'components/custom/notifications-card/elements/notification/types';
import { format } from 'date-fns';

const Notification = ({
  status,
  text,
  createdAt,
  ...props
}: TNotificationProps) => (
  <NotificationMain {...props}>
    <NotificationContent>
      <NotificationStatus status={status} />
      <NotificationText> {text} </NotificationText>
    </NotificationContent>
    <NotificationDate>
      {createdAt ? format(new Date(createdAt), 'MMM dd, yyyy | h:mm a') : null}
    </NotificationDate>
  </NotificationMain>
);

export default Notification;
