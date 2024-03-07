import React from 'react';
import {
  LabelMain,
  LabelHelper,
  LabelRequired,
} from 'components/ui/label/styles';
import { TLabelProps } from 'components/ui/label/types';
import { Tooltip } from '@mui/material';
import { InfoIcon } from 'components/svg';

const Label = ({ children, helper, required, ...props }: TLabelProps) => (
  <LabelMain {...props}>
    {children}
    {required && <LabelRequired>*</LabelRequired>}
    {!!helper && (
      <Tooltip title={helper}>
        <LabelHelper>
          <InfoIcon />
        </LabelHelper>
      </Tooltip>
    )}
  </LabelMain>
);

export default Label;
