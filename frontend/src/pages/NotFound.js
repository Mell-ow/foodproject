import React from 'react';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-9xl font-bold text-gray-200">404</h1>
      <h2 className="text-3xl font-semibold text-gray-800 mt-4">Page Not Found</h2>
      <p className="text-gray-500 mt-2 max-w-md">The page you are looking for doesn't exist or has been moved.</p>
      <a href="/" className="mt-8 px-6 py-3 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-700 transition-colors">
        Return Home
      </a>
    </div>
  );
};

export default NotFound;