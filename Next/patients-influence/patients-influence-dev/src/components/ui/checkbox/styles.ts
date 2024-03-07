import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { TCheckboxColor, TCheckboxSize } from 'components/ui/checkbox/types';
import { CheckIcon } from 'components/svg';
import { Label } from 'components/ui';

const sizes = {
  small: 14,
  medium: 18,
  large: 24,
};

export const CheckboxMain = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
        display: flex;
        align-items: center;
        gap: ${theme.spacing(2)}
    `}
`;

export const CheckboxDisplayIcon = styled(CheckIcon)`
  width: 100%;
  height: 100%;
  display: block;
  transform: scale(0);
  transition: transform 150ms ease-in-out, color 150ms ease-in-out;
`;

export const CheckboxDisplay = styled.div<{
  theme?: Theme;
  size: TCheckboxSize;
  color: TCheckboxColor;
}>`
  ${({ theme, size, color }) => `
    width: ${sizes[size]}px;
    height: ${sizes[size]}px;
    padding: ${theme.spacing(0.25)};
    border-width: 2px;
    border-style: solid;
    border-color: ${theme.palette[color].main}20;
    border-radius: 4px;
    user-select: none;
    transition: border-color 150ms ease-in-out;
    cursor: pointer;
    ${CheckboxDisplayIcon} {
      color: ${theme.palette[color].main}20;
    }
  `}
`;

export const CheckboxInput = styled.input<{
  theme?: Theme;
  color: TCheckboxColor;
}>`
  ${({ theme, color }) => `
    &:checked ~ ${CheckboxDisplay} {
      border-color: ${theme.palette[color].main};
      ${CheckboxDisplayIcon} {
        color: ${theme.palette[color].main};
        transform: scale(1);
      }
    }
  `}
`;

export const CheckboxLabel = styled(Label)<{
  theme?: Theme;
}>`
  ${({ theme }) => `
      display: block;
      font-size: 14px;
      color: ${theme.palette.common.gray[8]};
      user-select: none;
      cursor: pointer;
      pointer-events: none;
      text-wrap: wrap;

      a {
        pointer-events: all !important;
      }      
    `}
`;
