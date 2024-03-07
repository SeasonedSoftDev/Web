import React from 'react';

export type TAddBenefitModalProps = React.HTMLAttributes<HTMLDivElement> & {
  onClose: () => void;
  reload: () => Promise<void>;
};
