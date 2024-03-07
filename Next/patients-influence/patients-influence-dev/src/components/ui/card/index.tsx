import React, { forwardRef } from 'react';
import { CardMain } from 'components/ui/card/styles';
import { TCardProps, TCardRef } from 'components/ui/card/types';

const Card = forwardRef<TCardRef, TCardProps>(
  ({ animation = 'none', ...props }, ref) => (
    <CardMain animation={animation} ref={ref} {...props} />
  )
);

export default Card;
