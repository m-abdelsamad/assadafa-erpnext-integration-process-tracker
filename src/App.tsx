import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ProcessList } from './pages/ProcessList';
import { ProcessDetail } from './pages/ProcessDetail';
import { NotFound } from './pages/NotFound';
export function App() {
  return <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<ProcessList />} />
          <Route path="/processes" element={<ProcessList />} />
          <Route path="/processes/:correlationId" element={<ProcessDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>;
}