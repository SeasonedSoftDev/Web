import React from 'react';

export type TAddSuggestionModalProps = React.HTMLAttributes<HTMLDivElement> & {
  onClose: () => void;
  reload: () => void;
};
