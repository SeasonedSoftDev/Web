import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { Stack } from 'components/system';

export const DemographicsWrapper = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    padding: 0 25px;
  `}
`;

export const CreateSurveyPageMain = styled(Stack)``;

export const AddQuestion = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
      display: flex;
      align-items: center;
      gap: ${theme.spacing(2.5)};
      color: ${theme.palette.primary.main};
      cursor: pointer;
      font-weight: 700;
    `}
`;

export const CreateSurveyActions = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: ${theme.spacing(5)} 0 0;
  `}
`;

export const QuestionContainer = styled(Stack)``;

export const CreditContainer = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    width: ${theme.spacing(6)};
    height: ${theme.spacing(6)};
    margin: 0 ${theme.spacing(2.5)};
    display: grid;
    place-items: center;
    background: ${theme.palette.secondary.light}40;
    color: ${theme.palette.secondary.main};
    border-radius: 20px;
    font-size: 12.5px;
  `}
`;

export const CreateSurveyButtons = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${theme.spacing(5)} 0 0;
  `}
`;

export const BarChartWrapper = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
  min-width: 600px;
  width: 100%;
  height: 300px;
  margin: 50px 0px;
  `}
`;

export const ChartWrapper = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    display: flex;
    gap: 20px;

    ${theme.breakpoints.down('md')} {
      flex-direction: column;
    }
  `}
`;
