import React, { useState } from 'react';

const SimpleDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">LifelineDAG Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/20 backdrop-blur-sm p-6 rounded-xl border border-white/30">
            <h2 className="text-2xl font-semibold mb-4">Crisis Intelligence</h2>
            <p className="text-white/80">Real-time emergency monitoring</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm p-6 rounded-xl border border-white/30">
            <h2 className="text-2xl font-semibold mb-4">Identity Verification</h2>
            <p className="text-white/80">Register & verify responders</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm p-6 rounded-xl border border-white/30">
            <h2 className="text-2xl font-semibold mb-4">Emergency Declare</h2>
            <p className="text-white/80">Declare emergencies</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm p-6 rounded-xl border border-white/30">
            <h2 className="text-2xl font-semibold mb-4">Access Control</h2>
            <p className="text-white/80">Manage permissions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleDashboard;
