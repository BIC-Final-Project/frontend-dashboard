import React, { useState } from 'react';

const Button = ({ label, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseStyle = {
    backgroundColor: '#3A5913', // Warna background button
    color: 'white',             // Warna teks
    borderRadius: '8px',        // Border radius
    padding: '10px 20px',       // Padding, adjust sesuai kebutuhan
    border: 'none',             // Tanpa border
    cursor: 'pointer',          // Tampilkan pointer ketika hover
  };

  const hoverStyle = {
    backgroundColor: '#2e4710', // Warna background button saat hover
  };

  const buttonStyle = isHovered ? { ...baseStyle, ...hoverStyle } : baseStyle;

  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {label}
    </button>
  );
};

export default Button;
