import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4">
      <div className="max-w-lg text-center">
        {/* 404 Icon/Illustration */}
        <div className="mb-8">
          <svg
            className="w-40 h-40 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Main Message */}
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-700 mb-6">
          Oops! Page Not Found
        </h2>
        
        {/* Helpful Message */}
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
          Here are some helpful links:
        </p>

        {/* Navigation Suggestions */}
        <div className="space-y-4">
          <Link 
            to="/"
            className="block w-full px-6 py-3 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition duration-150 ease-in-out"
          >
            Return Home
          </Link>

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/contact"
              className="px-6 py-3 text-base font-medium text-indigo-600 hover:text-indigo-500 rounded-lg border border-transparent hover:border-indigo-600 transition duration-150 ease-in-out"
            >
              Contact Support
            </Link>
            <Link 
              to="/sitemap"
              className="px-6 py-3 text-base font-medium text-indigo-600 hover:text-indigo-500 rounded-lg border border-transparent hover:border-indigo-600 transition duration-150 ease-in-out"
            >
              View Sitemap
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;