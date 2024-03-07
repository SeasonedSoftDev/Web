import React from 'react';

export type TNotificationSettings = React.HTMLAttributes<HTMLDivElement> & {
  onClose: () => void;
};
