import React from 'react';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-2">
    <div className="animate-spin rounded-full h-6 w-6 border-2 border-t-2 border-primary"></div>
  </div>
);

export default LoadingSpinner; 