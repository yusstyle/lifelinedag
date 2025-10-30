// src/components/TestComponent.jsx
import React from 'react';

const TestComponent = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Tailwind Test
        </h1>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
          <p className="text-white">If you see styled components, Tailwind is working!</p>
          <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
            Test Button
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestComponent;