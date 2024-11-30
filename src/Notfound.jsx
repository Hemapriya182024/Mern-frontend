import React from 'react';

const Notfound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 text-gray-800 p-8">
      <img
        src="/Notfound.jpg"
        alt="Page under development"
        className="w-1/2 max-w-sm rounded-lg shadow-lg border-2 border-gray-300"
      />
      <h1 className="text-4xl font-bold mt-8">Oops! Page Under Development</h1>
      <p className="text-lg text-gray-600 mt-4">
        The page you're looking for is currently under development. Please check back later!
      </p>
      <button
        className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-sm transition duration-300"
        onClick={() => window.history.back()}
      >
        Go Back
      </button>
    </div>
  );
};

export default Notfound;
