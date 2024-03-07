import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { Stack } from 'components/system';

export const SurveyInfluencersQuestionsMain = styled(Stack)``;

export const QuestionContainer = styled(Stack)``;

export const CreateSurveyActions = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: ${theme.spacing(5)} 0 0;
  `}
`;
