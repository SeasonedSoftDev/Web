import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import Link from 'next/link';

export const SidebarItemIcon = styled.div<{
  theme?: Theme;
  isDisabled?: boolean;
}>`
  ${({ theme, isDisabled }) => `   
    width: 24px;
    height: 24px;
    color: ${
      isDisabled
        ? `${theme.palette.common.gray[5]}`
        : `${(theme.palette.common as any).gray[9]}`
    };

    svg{
        width: 100%;
        height: 100%;
    }
    `}
`;

export const SidebarItemLabel = styled.span<{
  theme?: Theme;
  isDisabled?: boolean;
}>`
  ${({ theme, isDisabled }) => `
        font-size: 14px;
        color: ${
          isDisabled
            ? `${theme.palette.common.gray[5]}`
            : `${(theme.palette.common as any).gray[9]}`
        };
    `}
`;

export const SidebarItemMain = styled.div<{
  theme?: Theme;
  isDisabled?: boolean;
}>`
  ${({ theme, isDisabled }) => `
    display: flex;
    align-items: center;
    gap: ${theme.spacing(2.5)};
    border-radius: 10px 0 0 10px;
    cursor: ${isDisabled ? `unset` : `pointer`};
`}
`;

export const SidebarItemOuter = styled(Link)<{
  theme?: Theme;
  isactive: string;
}>`
  ${({ theme, isactive }) => `
    user-select: none;
    border-radius: 10px 0 0 10px;
    cursor: pointer;
    padding: ${theme.spacing(2.5)} 0 ${theme.spacing(2.5)} ${theme.spacing(5)};
    display: block;
    text-decoration: none;
    ${
      isactive === 'true' &&
      `
        background-color: ${theme.palette.common.background};
        ${SidebarItemIcon}{
            color: ${theme.palette.secondary.main};
        }
        ${SidebarItemLabel}{
            color: ${theme.palette.primary.main};
        }
    `
    }
    `}
`;

export const SidebarDisabledItemOuter = styled('div')<{
  theme?: Theme;
}>`
  ${({ theme }) => `
    user-select: none;
    border-radius: 10px 0 0 10px;
    cursor: pointer;
    padding: ${theme.spacing(2.5)} 0 ${theme.spacing(2.5)} ${theme.spacing(5)};
    display: block;
    text-decoration: none;
    `}
`;
