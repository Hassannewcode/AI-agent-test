
import React from 'react';

const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9.93 2.07a1 1 0 0 0-1.86 0L6.61 5.14a1 1 0 0 1-1.42 0L2.07 3.56a1 1 0 0 0-1.86 1.86l1.58 3.12a1 1 0 0 1 0 1.42L.21 13.07a1 1 0 0 0 1.86 1.86l3.12-1.58a1 1 0 0 1 1.42 0l1.46 3.07a1 1 0 0 0 1.86 0l1.46-3.07a1 1 0 0 1 1.42 0l3.12 1.58a1 1 0 0 0 1.86-1.86l-1.58-3.12a1 1 0 0 1 0-1.42l1.58-3.12a1 1 0 0 0-1.86-1.86l-3.12 1.58a1 1 0 0 1-1.42 0L9.93 2.07Z" />
    <path d="M18 6h.01" />
    <path d="M21 12h.01" />
    <path d="M18 18h.01" />
  </svg>
);

export default SparklesIcon;
