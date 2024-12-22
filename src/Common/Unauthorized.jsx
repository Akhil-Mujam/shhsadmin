import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  const goback = () => navigate(-1);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-red-600">Unauthorized Access</h1>
      <p className="mt-4 text-lg text-center text-gray-700">
        You do not have permission to view this page. This section is restricted to teachers or administrators.
      </p>
      <div className="mt-6 space-x-4">
        <Link
          to="/login" 
          className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Go to Login
        </Link>
        <button 
          onClick={goback} 
          className="px-6 py-3 bg-gray-300 text-black rounded-md hover:bg-gray-400"
        >
          Go Back
        </button>
      </div>
      <p className="mt-4 text-sm text-gray-600">
        If you believe you should have access to this page, please contact your administrator.
      </p>
    </div>
  );
};

export default Unauthorized;
