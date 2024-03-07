import styled from '@emotion/styled';
import { Theme } from '@mui/material';

export const MaintenanceMain = styled.div`
  display: grid;
  grid-template-columns: auto;
  place-items: center;
  width: 100%;
  text-align: center;
  gap: 30px;

  span {
    margin-top: -15px;
    margin-left: 2px;
    margin-right: 2px;
  }
`;

export const MaintenanceTitle = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    font-size: 36px;
    color: ${theme.palette.primary.main};
    text-transform: uppercase;
    font-weight: 900;
  `}
`;

export const AffiliateLink = styled.span<{ theme?: Theme }>`
  ${({ theme }) => `
    color: ${theme.palette.secondary.main};

    &:hover {
      color: ${theme.palette.primary.main};
    }
  `}
`;
