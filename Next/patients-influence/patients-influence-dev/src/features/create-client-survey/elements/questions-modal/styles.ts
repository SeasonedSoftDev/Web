import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { Grid } from 'components/system';

export const QuestionsModalMain = styled(Grid)`
  width: 100%;
`;

export const QuestionsContainer = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
  display: flex;
  flex-direction: column;
  `}
`;

export const QuestionTop = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #F1F4FF;
  padding: ${theme.spacing(2.5)} ${theme.spacing(5)};
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  `}
`;

export const QuestionBottom = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
  padding-left: ${theme.spacing(5)};
 `}
`;
