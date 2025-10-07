import React from 'react';

// Using a "git merge" style icon to represent interconnected scene nodes, as requested by the user's image.
export const MapIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" {...props}>
    <circle cx="6" cy="18" r="2.25" />
    <circle cx="6" cy="6" r="2.25" />
    <circle cx="18" cy="12" r="2.25" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6c0 3.314 2.686 6 6 6h1.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18c0-3.314 2.686-6 6-6h1.5" />
  </svg>
);
