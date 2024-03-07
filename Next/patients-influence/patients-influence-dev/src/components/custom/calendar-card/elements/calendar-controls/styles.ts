import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { Button } from 'components/ui';

export const SCalendarControlsMain = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
        display: flex;
        align-items: center;
    `}
`;

export const SCalendarControlsButton = styled(Button)`
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  svg {
    width: 15px;
    height: 15px;
    display: block;
  }
  &:first-of-type {
    border-radius: 8px 0px 0px 8px;
  }

  &:last-of-type {
    border-radius: 0px 8px 8px 0px;
  }
`;

export const SCalendarControlsDisplay = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    width: 80px;
    height: 30px;
    border: 1px solid ${theme.palette.primary.main};
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 12px;
    text-transform: uppercase;
    font-weight: 500;
  `}
`;
