import { IPaginatedBenefit } from 'api/benefits/types';
import React from 'react';

export type TChangeBenefitModalProps = React.HTMLAttributes<HTMLDivElement> & {
  onClose: () => void;
  reload: () => Promise<void>;
  data: IPaginatedBenefit;
};
