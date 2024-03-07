import { VerifiedIcon } from 'components/svg';
import React from 'react';

const Step = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: ' 50vh',
    }}
  >
    <span style={{ position: 'relative', padding: '0px 10px' }}>
      Congratulations, you&apos;ve successfully completed all verification
      steps! Your account is now pending approval.
      <VerifiedIcon
        width="20"
        height="20"
        style={{
          color: '#2D3779',
          marginLeft: '10px',
          position: 'absolute',
          bottom: '3px',
        }}
      />{' '}
    </span>
  </div>
);

export default Step;
