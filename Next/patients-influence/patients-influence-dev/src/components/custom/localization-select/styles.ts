import styled from '@emotion/styled';
import { MenuItem, Select, Theme } from '@mui/material';
import { TLocalizationColor } from 'components/custom/localization-select/types';

export const SLocalizationSelectMain = styled(Select)<{
  theme?: Theme;
  color: TLocalizationColor;
}>`
  ${({ theme, color }) => `
    text-align: center;
    border: none;
    display: flex;
    align-items: center;
    .MuiOutlinedInput-notchedOutline {
      border: none;
    }
    .MuiSelect-select {
      color: ${theme.palette[color].main};
      padding: ${theme.spacing(2)};
    }
    .MuiSelect-icon {
      fill: ${theme.palette[color].main};
    }
  `}
`;

export const SLocalizationSelectOption = styled(MenuItem)<{ theme?: Theme }>``;
