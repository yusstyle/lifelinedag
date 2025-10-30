import React, { useState } from 'react';

const WalletConnect = ({ onConnect, onDisconnect }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async () => {
    try {
      setLoading(true);
      setError('');
      // Simulate wallet connection
      const mockAccount = '0x742d35Cc6634C0532925a3b8bc8';
      onConnect({ account: mockAccount, isConnected: true });
    } catch (err) {
      setError('Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto'>
      <div className='text-center mb-6'>
        <div className='w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 animate-float'>
          🚑
        </div>
        <h2 className='text-3xl font-bold text-gray-800 mb-2'>LifelineDAG</h2>
        <p className='text-gray-600'>Emergency Response Platform</p>
      </div>

      <button
        onClick={handleConnect}
        disabled={loading}
        className='w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 shadow-lg'
      >
        {loading ? 'Connecting...' : '🔗 Connect Wallet'}
      </button>
    </div>
  );
};

export default WalletConnect;
