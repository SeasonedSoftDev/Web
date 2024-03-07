import React from 'react';

export type TSingleCommentProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string;
  index: number;
  onEdit: (index: number, value: string) => void;
  onDelete: (index: number) => void;
};
