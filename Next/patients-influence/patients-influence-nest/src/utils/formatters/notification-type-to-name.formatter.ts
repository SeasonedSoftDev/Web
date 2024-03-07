import { NotificationType } from '../enums';

export const NotificationTypeToName = (id: number) => {
  const key = Object.keys(NotificationType).find(
    (k) => NotificationType[k] === id,
  );
  if (!key) throw new Error('Invalid notification type');
  return key;
};
