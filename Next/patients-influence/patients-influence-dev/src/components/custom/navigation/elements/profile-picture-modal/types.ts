import React from 'react';

export type TProfilePicture = React.HTMLAttributes<HTMLDivElement> & {
  onClose: () => void;
};
