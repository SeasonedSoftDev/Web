import styled from '@emotion/styled';
import { Menu } from 'components/custom';
import { Theme } from '@mui/material';
import Link from 'next/link';

export const ActionsMenu = styled(Menu)<{
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

export const CardWrapper = styled.div<{
  theme?: Theme;
}>`
  ${({ theme }) => `
      width: 428px;
    `}
`;
