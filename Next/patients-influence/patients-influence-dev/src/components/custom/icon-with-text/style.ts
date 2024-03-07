import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { gradient } from 'utilities/style';

export const IconWithTextMain = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    display: grid;
    grid-template-columns: 60px auto;
    align-items: center;
    gap: ${theme.spacing(4)};

      ${theme.breakpoints.down('sm')} {
        display: grid;
        grid-template-columns: 1fr;
        place-items: center;
      }
    `}
`;

export const IconWithTextIcon = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    width: 60px;
    height: 60px;
    border-radius: 40px;
    background: ${gradient(45, [
      theme.palette.primary.dark,
      theme.palette.secondary.light,
    ])};
    display: grid;
    place-items: center;
    margin-right: ${theme.spacing(4)};
    
    & svg{
        color: #fff;
        width: 30px;
        height: 30px;
    }

    `}
`;

export const IconWithTextText = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(2)}
    `}
`;

export const IconWithTextTitle = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    color: #7e839f;
    font-size: 22px;
    
    ${theme.breakpoints.down('sm')} {
      text-align: center;
    }
  `}
`;

export const IconWithTextP = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    color: ${theme.palette.primary.main};
    font-weight: 400;
    font-size: 14px;

    ${theme.breakpoints.down('sm')} {
      text-align: center;
    }
    `}
`;
