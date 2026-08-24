import React from 'react';

/**
 * AlmulhemLogo Component
 * 
 * Displays the company logo image.
 * The logo has colorful elements (blue, coral, green) with dark text,
 * so it works best on light backgrounds. On dark backgrounds, we invert it to white.
 */
const AlmulhemLogo = ({ isDarkBg = false, className = "" }) => {
  return (
    <img
      src="/logo.webp"
      alt="سفريات الملحم - Almulhim Travel"
      width={160}
      height={52}
      className={`object-contain ${className} ${isDarkBg ? 'brightness-0 invert' : ''
        }`}
    />
  );
};

export default AlmulhemLogo;
