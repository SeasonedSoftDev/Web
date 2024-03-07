import React from 'react';

export type TStackProps = React.HTMLAttributes<HTMLDivElement> & {
  direction?: 'vertical' | 'horizontal';
};
