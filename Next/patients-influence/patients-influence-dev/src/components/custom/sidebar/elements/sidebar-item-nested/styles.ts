import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import Link from 'next/link';

export const SidebarItemNestedDropDown = styled.div<{
  theme?: Theme;
  expanded: boolean;
}>`
  ${({ theme, expanded }) => `
        padding-left: ${theme.spacing(4)};
        margin-top: ${expanded ? theme.spacing(3) : 0};
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        overflow: hidden;
        max-height: ${expanded ? 200 : 0}px;
        transition: max-height 300ms ease-in-out, margin-top 300ms ease-in-out;
    `}
`;

export const SidebarItemNestedDropDownSubItem = styled(Link)<{ theme?: Theme }>`
  ${({ theme }) => `
        text-decoration: none;
        padding: ${theme.spacing(1)} 0;
    `}
`;

export const SidebarItemNestedDropDownSubItemLabel = styled.span<{
  theme?: Theme;
  active: boolean;
}>`
  ${({ theme, active }) => `
        font-size: 14px;
        color: ${
          active
            ? theme.palette.primary.main
            : (theme.palette.common as any).gray[6]
        };
    `}
`;

export const SidebarItemNestedIcon = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `   
    width: 24px;
    height: 24px;
    color: ${(theme.palette.common as any).gray[9]};
    svg{
        width: 100%;
        height: 100%;
    }
    `}
`;

export const SidebarItemNestedLabel = styled.span<{ theme?: Theme }>`
  ${({ theme }) => `
        font-size: 14px;
        color: ${(theme.palette.common as any).gray[9]};
    `}
`;

export const SidebarItemNestedMain = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    display: flex;
    align-items: center;
    gap: ${theme.spacing(2.5)};
    border-radius: 10px 0 0 10px;
    cursor: pointer;
`}
`;

export const SidebarItemNestedOuter = styled.div<{
  theme?: Theme;
  active: boolean;
}>`
  ${({ theme, active }) => `
    user-select: none;
    border-radius: 10px 0 0 10px;
    cursor: pointer;
    padding: ${theme.spacing(2.5)} 0 ${theme.spacing(2.5)} ${theme.spacing(5)};
    display: block;
    text-decoration: none;
    ${
      active &&
      `
        background-color: ${theme.palette.common.background};
        ${SidebarItemNestedIcon}{
            color: ${theme.palette.secondary.main};
        }
        ${SidebarItemNestedLabel}{
            color: ${theme.palette.primary.main};
        }
    `
    }
    `}
`;

export const SidebarItemNestedExpandIcon = styled.div<{ expanded: boolean }>`
  ${({ expanded }) => `
    width: 14px;
    height: 14px;
    transform: scaleY(${expanded ? -1 : 1});
    transition: transform 500ms ease-in-out;
    svg {
      display: block;
      width: 100%;
      height: 100%;
    }
    `}
`;
