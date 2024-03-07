import React from 'react';
import { CollapseMain, CollapseInner } from 'components/system/collapse/styles';
import { TCollapseProps } from 'components/system/collapse/types';

const Collapse = ({
  removeGap = false,
  children,
  in: collapseIn = true,
  ...props
}: TCollapseProps) => (
  <CollapseInner in={collapseIn} removeGap={removeGap}>
    <CollapseMain in={collapseIn} {...props}>
      {children}
    </CollapseMain>
  </CollapseInner>
);

export default Collapse;
