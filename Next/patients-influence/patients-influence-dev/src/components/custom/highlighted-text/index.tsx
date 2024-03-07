import React from 'react';
import { HighlightedTextMain } from 'components/custom/highlighted-text/styles';
import { THighlightedTextProps } from 'components/custom/highlighted-text/types';

const HighlightedText = ({ ...props }: THighlightedTextProps) => (
  <HighlightedTextMain {...props} />
);

export default HighlightedText;
