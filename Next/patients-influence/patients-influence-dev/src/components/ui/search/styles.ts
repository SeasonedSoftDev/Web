import styled from '@emotion/styled';
import { Theme } from '@mui/material';

export const SearchMain = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    width: 300px;
    background-color: ${theme.palette.common.white}20;
    border-radius: 8px;
    display: flex;
    align-items: flex-start;
    border-width: 1px;
    border-color: ${theme.palette.common.black}20;
    border-style: solid;
    cursor: text;
    position: relative;
  `}
`;

export const SearchIcon = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    height: 36px;
    width: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    color: ${theme.palette.common.white}80;
    svg {
      width: 20px;
      height: 20px;
    }
  `}
`;

export const SearchInput = styled.input<{ theme?: Theme }>`
  ${({ theme }) => `
    background: none;
    border: none;
    outline: none;
    padding: ${theme.spacing(2.5)} ${theme.spacing(2)};
    flex: 1 auto;
    color: ${theme.palette.common.white};
    &::placeholder {
      color: ${theme.palette.common.white}80;
    }
  `}
`;
