import React from 'react';

function SuspenseContent() {
  return (
    <div className="w-full h-screen flex items-center justify-center text-gray-300 dark:text-gray-200 bg-base-100">
      <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
    </div>
  );
}

export default SuspenseContent;
