import React from 'react';
import {
  AvatarMain,
  AvatarText,
  AvatarImage,
} from 'components/ui/avatar/styles';
import { TAvatarProps } from 'components/ui/avatar/types';

const Avatar = ({ children, image, ...props }: TAvatarProps) => (
  <AvatarMain {...props}>
    <AvatarText>{children}</AvatarText>
    <AvatarImage src={image} />
  </AvatarMain>
);

export default Avatar;
