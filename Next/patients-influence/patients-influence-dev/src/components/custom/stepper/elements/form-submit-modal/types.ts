import React from 'react';

export type TPromptFormSubmitModalProps =
  React.HTMLAttributes<HTMLDivElement> & {
    onClose: () => void;
    onSubmit: (event: React.FormEvent<HTMLDivElement>) => Promise<void>;
  };
