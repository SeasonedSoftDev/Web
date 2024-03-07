import { Theme } from '@mui/material';
import { DragControls } from 'framer-motion';
import styled from '@emotion/styled';

export const OrderListDraggableMain = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
        padding: ${theme.spacing(2, 0)};
        display: flex;
        align-items: center;
        gap: ${theme.spacing(2)};
        height: 50px;
  `}
`;

export const OrderListDraggableDrag = styled.div<{
  theme?: Theme;
  dragControls: DragControls;
}>`
  ${({ theme }) => `
      width: 20px;
      height: 30px;
      color: ${theme.palette.common.gray[6]};
      cursor: grab;
      &:hover {
        color: ${theme.palette.common.gray[10]};
      }
      &:active {
        cursor: grabbing;
      }
      svg {
        width: 100%;
        height: 100%;
        display: block;
      }
  `}
`;
