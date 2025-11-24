import React from 'react';
import { useNavigate } from 'react-router-dom';
export function Navbar() {
  const navigate = useNavigate();
  return <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => navigate('/')} className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img src="/image.png" alt="Assadafa" className="h-10" />
            <span className="text-xl font-semibold text-gray-800">
              Sales Automation Platform
            </span>
          </button>
          <div className="flex items-center space-x-6">
            <button onClick={() => navigate('/')} className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Process Tracker
            </button>
          </div>
        </div>
      </div>
    </nav>;
}