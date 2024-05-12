import React from 'react';

const CardInput = ({ title, children }) => {
  return (
    <div className="mb-8">
      <div className="bg-gray-700 p-2 rounded">
        <h2 className="text-lg">{title}</h2>
      </div>
      <div className="border border-gray-700 p-5 rounded">
        {children}
      </div>
    </div>
  );
};

export default CardInput;
