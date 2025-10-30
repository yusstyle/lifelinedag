// src/components/crisis/Dashboard.jsx
import React, { useState } from 'react';
import IdentityRegister from './IdentityRegister';
import EmergencyDeclare from './EmergencyDeclare';
import CrisisDashboard from './CrisisDashboard';
import AccessControl from './AccessControl';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('crisis-dashboard');

  const tabs = [
    {
      id: 'crisis-dashboard',
      label: '📊 Crisis Intelligence',
      icon: '📊',
      component: <CrisisDashboard />,
      description: 'Real-time emergency monitoring & analytics'
    },
    {
      id: 'identity-register', 
      label: '🆔 Verify Identity',
      icon: '🆔',
      component: <IdentityRegister />,
      description: 'Register & verify emergency responder identity'
    },
    {
      id: 'emergency-declare',
      label: '🚨 Declare Emergency',
      icon: '🚨',
      component: <EmergencyDeclare />,
      description: 'Report verified crisis situations globally'
    },
    {
      id: 'access-control',
      label: '🔐 Access Management',
      icon: '🔐',
      component: <AccessControl />,
      description: 'Control crisis data access & permissions'
    }
  ];

  const activeComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {/* Emergency Alert Bar */}
      <div className="bg-red-500/10 border-b border-red-500/20">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
            <p className="text-red-300 text-sm font-semibold">
              🚨 LIFELINEDAG GLOBAL EMERGENCY NETWORK ACTIVE • BLOCKDAG SYNC: 100% • ENCRYPTION: AES-256 ACTIVE
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Tab Navigation */}
      <div className="bg-white/5 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex space-x-2 overflow-x-auto py-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-4 px-8 py-4 rounded-2xl font-bold transition-all duration-300 min-w-max border-2 ${
                  activeTab === tab.id
                    ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 border-blue-400 shadow-2xl shadow-blue-500/30 scale-105'
                    : 'text-blue-300 bg-white/5 border-white/10 hover:bg-white/10 hover:text-white hover:scale-105 hover:border-blue-400/50'
                }`}
              >
                <span className="text-2xl">{tab.icon}</span>
                <div className="text-left">
                  <div className="text-lg font-black">{tab.label}</div>
                  <div className="text-xs opacity-80 font-medium">{tab.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-6 py-8">
        <div className="animate-fade-in">
          {activeComponent}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;