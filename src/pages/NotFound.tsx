import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestionIcon } from 'lucide-react';
export function NotFound() {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <FileQuestionIcon className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        <button onClick={() => navigate('/')} className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
          Go to Home
        </button>
      </div>
    </div>;
}