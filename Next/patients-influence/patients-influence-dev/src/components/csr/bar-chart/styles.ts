import styled from '@emotion/styled';

export const BarChartMain = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

export const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0);
  backdrop-filter: blur(5px);
  z-index: 999;

  span {
    color: dark-grey;
    font-size: 24px;
    text-align: center;
  }
`;
