import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { Card } from 'components/ui';

export const HelpPageMain = styled(Card)``;

export const HelpPageContact = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
        display: grid;
        grid-template-columns: 1fr 1fr;
        padding-bottom: ${theme.spacing(20)};

        ${theme.breakpoints.down('xl')} {
            grid-template-columns: 1fr;
        }
        ${theme.breakpoints.down('lg')} {
            grid-template-columns: 1fr 1fr;
        }
        ${theme.breakpoints.down('md')} {
            grid-template-columns: 1fr;
        }
    `}
`;

export const HelpPageContactContainer = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing(5)};

        &:first-of-type {
            border-right: 1px solid ${theme.palette.default.main};
            padding-right: ${theme.spacing(15)};
        }

        &:last-of-type {
            padding-left: ${theme.spacing(15)};
            height: 100%;
        }

        ${theme.breakpoints.down('xl')} {
            &:first-of-type {
                border-right: unset;
                border-bottom: 1px solid ${theme.palette.default.main};
                padding-right: 0;
                padding-bottom: ${theme.spacing(10)};
            }
            &:last-of-type {
                border: none;
                padding-left: 0;
                padding-top: ${theme.spacing(10)};
            }
        }

        ${theme.breakpoints.down('lg')} {
            &:first-of-type {
                border-right: 1px solid ${theme.palette.default.main};
                padding-right: ${theme.spacing(15)};
                padding-top: 0;
            }
    
            &:last-of-type {
                padding-left: ${theme.spacing(15)};
                padding-bottom: 0;
            }
        }

        ${theme.breakpoints.down('md')} {
            &:first-of-type {
                border-right: unset;
                border-bottom: 1px solid ${theme.palette.default.main};
                padding-right: 0;
                padding-bottom: ${theme.spacing(10)};
            }
    
            &:last-of-type {
                border: none;
                padding-left: 0;
                padding-top: ${theme.spacing(10)};
            }
        }
    `}
`;

export const HelpPageIconWithTextContainer = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
            display: flex;
            flex-direction: column;

            h2 {
                color: #464e5f;
              }

            ${theme.breakpoints.down('md')} {
                align-items: center;
            }
        `}
`;

export const HelpPageIconWithTextIContainer = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
            display: flex;
            flex-direction: column;
            gap: ${theme.spacing(10)};

            ${theme.breakpoints.down('md')} {
                align-items: center;
            }
        `}
`;
