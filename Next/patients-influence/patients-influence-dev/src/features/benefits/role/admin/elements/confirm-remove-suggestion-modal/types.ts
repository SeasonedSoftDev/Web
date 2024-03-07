import { IBenefitSuggestion } from 'api/benefits/types';
import React from 'react';

export type TConfirmRemoveSuggestionModalProps =
  React.HTMLAttributes<HTMLDivElement> & {
    onClose: () => void;
    handleAction: () => void;
  };
