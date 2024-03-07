import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { StyledChipProps } from './types';

const getSize = (size: string) => {
  switch (size) {
    case 'xsmall':
      return '10px';
    case 'small':
      return '12px';
    case 'medium':
      return '14px';
    case 'large':
      return '16px';
    default:
      return '12px';
  }
};

const getTypeColors = (type: string) => {
  switch (type) {
    // Submitted
    case 'primary':
      return { backgroundColor: '#2D3779', color: '#fff' };
    // Invited
    case 'secondary':
      return { backgroundColor: '#3A66A4', color: '#fff' };
    // Approved
    case 'success':
      return { backgroundColor: '#CBF3F1', color: '#11CABE' };
    // Removed
    case 'danger':
      return { backgroundColor: '#FFCECE', color: '#E95151' };
    // Not Invited
    case 'neutral':
      return { backgroundColor: '#F1F4FF', color: '#7E839F' };
    // To be signed
    case 'lightblue':
      return { backgroundColor: 'rgba(88, 120, 221, 0.06)', color: '#448DC9' };
    default:
      return { backgroundColor: '#448DC9', color: '#FFFFFF' };
  }
};

export const ChipWrapper = styled.span<Omit<StyledChipProps, 'label'>>`
  display: inline-block;
  padding: ${(props) => (props.size === 'xsmall' ? '4px' : '8px')} 16px;
  border-radius: 16px;
  color: #fff;
  ${(props) => css(getTypeColors(props.type))}
  font-weight: 500;
  text-align: center;
  max-height: 33px;
  font-size: ${(props) => getSize(props.size)};
`;
