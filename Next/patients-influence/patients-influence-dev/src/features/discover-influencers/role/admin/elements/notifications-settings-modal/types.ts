import React from 'react';

export type TNotificationsSettingsModalProps =
  React.HTMLAttributes<HTMLDivElement> & {
    onClose: () => void;
  };
