import React from 'react';

import { TitleMain } from 'components/custom/title/style';

import { TTitleProps } from 'components/custom/title/types';

const Title = ({ title, ...props }: TTitleProps) => (
  <TitleMain {...props}> {title} </TitleMain>
);

export default Title;
