import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { Menu } from 'components/custom';

export const InPreparationActionsMain = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
        display: grid;
        position: relative;
        padding: ${theme.spacing(2)};
    `}
`;

export const InPreparationActionsMenu = styled(Menu)<{
  position: { right: number; top: number };
}>`
  ${({ position }) => `
  position: fixed;
  z-index: 200;
  width: 120px;
  right: ${position?.right}px;
  top: ${position?.top}px;
  `}
`;

export const ISpan = styled.div`
  text-align: center;
  cursor: pointer;
`;
