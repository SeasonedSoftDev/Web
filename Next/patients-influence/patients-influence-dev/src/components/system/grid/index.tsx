import React from 'react';
import { GridMain } from 'components/system/grid/styles';
import { TGridProps } from 'components/system/grid/types';

const Grid = ({ ...props }: TGridProps) => <GridMain {...props} />;

export default Grid;
