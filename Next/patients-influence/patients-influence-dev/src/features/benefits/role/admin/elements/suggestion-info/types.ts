import { IBenefitSuggestion } from 'api/benefits/types';
import React from 'react';

export type TSuggestionInfoModalProps = React.HTMLAttributes<HTMLDivElement> & {
  onClose: () => void;
  reload: () => Promise<void>;
  data: IBenefitSuggestion;
};
