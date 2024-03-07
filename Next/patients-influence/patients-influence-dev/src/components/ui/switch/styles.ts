import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { TSwitchColor } from 'components/ui/switch/types';
import { Label } from 'components/ui';

export const SwitchMain = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
        display: flex;
        align-items: center;
        gap: ${theme.spacing(2)};
    `}
`;

export const SwitchLabel = styled(Label)<{ theme?: Theme }>`
  ${({ theme }) => `
      font-size: 14px;
      color: ${theme.palette.common.gray[8]};
      user-select: none;
      cursor: pointer;
    `}
`;

export const SwitchDisplay = styled.div<{
  theme?: Theme;
  color: TSwitchColor;
}>`
  ${({ theme, color }) => `
  width: 40px;
  height: 24px;
  padding: 2px;
  border-radius: 15px;
  background-color: ${theme.palette[color].main}20;
  transition: background-color 300ms ease-in-out;
  cursor: pointer;
  &::before {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: ${theme.palette.common.white};
    content: '';
    display: block;
    box-shadow: 0 2px 6px ${theme.palette.common.black}20;
    transform: translateX(0px);
    transition: transform 300ms ease-in-out;
  }
  `}
`;

export const SwitchInput = styled.input<{
  theme?: Theme;
  color: TSwitchColor;
}>`
  ${({ color, theme }) => `
        &:checked ~ ${SwitchDisplay} {
            background-color: ${theme.palette[color].main};
            &::before {
                transform: translateX(16px);
            }
        }
    `}
`;
