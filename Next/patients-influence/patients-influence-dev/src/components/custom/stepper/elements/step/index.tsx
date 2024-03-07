import React, { forwardRef } from 'react';
import {
  TStepProps,
  TStepRef,
} from 'components/custom/stepper/elements/step/type';
import { StepMain } from 'components/custom/stepper/elements/step/styles';

const Step = forwardRef<TStepRef, TStepProps>((props, ref) => (
  <StepMain ref={ref} {...props} />
));

export default Step;
