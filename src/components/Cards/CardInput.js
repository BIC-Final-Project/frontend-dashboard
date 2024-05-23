import React from 'react';

const CardInput = ({ title, children }) => {
  return (
    <div className="mb-8">
      <div className="bg-[#B9C7C0] p-2 rounded">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="border border-[#B9C7C0] p-5 rounded">
        {children}
      </div>
    </div>
  );
};

export default CardInput;
