import React from 'react';

const CancelIcon = ({ ...props }) => (
  <svg viewBox="0 0 6 6" {...props}>
    <path
      d="M4.5 1.5L1.5 4.5M4.5 4.5L1.5 1.5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default CancelIcon;
