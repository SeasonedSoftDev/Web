import React from 'react';

export type TSignUpProps = React.HTMLAttributes<HTMLDivElement> & {
  onClose: () => void;
};
