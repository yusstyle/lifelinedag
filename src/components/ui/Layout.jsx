import React from 'react';

const Layout = ({ children, account, onDisconnect, activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
    { id: 'register', label: '👤 Register', icon: '👤' },
    { id: 'emergency', label: '🚨 Emergency', icon: '🚨' },
    { id: 'access', label: '🔐 Access', icon: '🔐' }
  ];

  const formatAddress = (addr) => {
   return addr ? '...' : '';
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-blue-50'>
      <header className='bg-gradient-to-r from-green-600 to-green-700 text-white shadow-xl'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center space-x-3'>
              <div className='w-12 h-12 bg-white rounded-full flex items-center justify-center text-green-600 text-xl font-bold animate-float'>
                🚑
              </div>
              <div>
                <h1 className='text-2xl font-bold'>LifelineDAG</h1>
                <p className='text-green-100 text-sm'>Emergency Response Platform</p>
              </div>
            </div>
            
            {account && (
              <div className='flex items-center space-x-4'>
                <div className='bg-green-500 px-4 py-2 rounded-full text-sm font-medium'>
                  🔗 {formatAddress(account)}
                </div>
                <button
                  onClick={onDisconnect}
                  className='bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors'
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>

          {account && (
            <nav className='flex space-x-1 bg-green-500 rounded-lg p-1'>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                className="flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 flex-1 text-center"
                >
                  <span className='text-lg'>{tab.icon}</span>
                  <span className='font-medium'>{tab.label}</span>
                </button>
              ))}
            </nav>
          )}
        </div>
      </header>

      <main className='container mx-auto px-4 py-8'>
        {children}
      </main>
    </div>
  );
};

export default Layout;
