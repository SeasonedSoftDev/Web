import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { Menu } from 'components/custom';

export const ToBeApprovedActionsMain = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    display: grid;
    place-items: center;
    position: relative;
    padding: ${theme.spacing(2)};
    cursor: pointer;
`}
`;

export const ToBeApprovedActionsMenu = styled(Menu)<{
  position: { right: number; top: number };
}>`
  ${({ position }) => `
  position: fixed;
  z-index: 200;
  min-width: 120px;
  width: 100%;
  max-width: fit-content;
  right: ${position?.right}px;
  top: ${position?.top}px;
  `}
`;

export const ISpan = styled.span`
  cursor: pointer;
`;
