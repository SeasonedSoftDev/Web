import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { Stack } from 'components/system';

export const QuestionMain = styled(Stack)`
  width: 100%;
`;

export const QuestionHeader = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #F1F4FF;
    padding: ${theme.spacing(2.5)} ${theme.spacing(5)};
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;

    // ${theme.breakpoints.down('md')} {
    //   flex-direction: column;
    //   align-items: start;
    //   gap: 20px;
    // }

    @media screen and (max-width: 842px)  {
      flex-direction: column;
      align-items: start;
      gap: 20px;
    }
    `}
`;

export const QuestionHeaderActions = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    display: flex;
    align-items: center;
    gap: ${theme.spacing(5)};
    width: 60%;
    
    input {
        width: 300px;
        background: #fff;
    }

    @media screen and (max-width: 520px) {
      flex-direction: column;
      max-width: 100%;
    }
    `}
`;

export const QuestionCounter = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  span {
    flex-basis: 15%;
  }

  input {
    background: white;
  }

  margin-right: 50px;
`;

export const QuestionActions = styled.div`
  display: grid;
  place-items: center;
  cursor: pointer;

  svg {
    width: 39px;
    height: 39px;
  }
`;

export const QuestionBody = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    padding: ${theme.spacing(5)} 0;
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(2)};
  `}
`;

export const QuestionFooter = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    margin-top: ${theme.spacing(5)};
    border-top: 1px solid ${theme.palette.common.gray[2]}50;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: ${theme.spacing(5)} 0;
    gap: ${theme.spacing(5)};

    svg {
        cursor: pointer;
    }
    `}
`;

export const QuestionOptions = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    display: flex;
    align-items:center;
    justify-content: flex-start;
  `}
`;

export const QuestionHighlight = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
        color: ${theme.palette.primary.main};
        font-weight: 600;
        margin: ${theme.spacing(1)};
        cursor: pointer;
    `}
`;
