import React from 'react';

export type TCardRef = HTMLDivElement;

export type TCardAnimation =
  | 'none'
  | 'zoom-in'
  | 'slide-left'
  | 'slide-right'
  | 'slide-down'
  | 'slide-up';

export type TCardProps = React.HTMLAttributes<HTMLDivElement> & {
  animation?: TCardAnimation;
};
