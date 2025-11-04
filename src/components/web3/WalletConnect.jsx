// src/components/WalletConnect.jsx - FIXED
import React, { useState } from 'react';

const WalletConnect = ({ onConnect, onDisconnect }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async () => {
    try {
      setLoading(true);
      setError('');
      // Simulate wallet connection
      const mockAccount = '0x742d35Cc6634C0532925a3b8Dc9B8eC7f2E5BdF1';
      const mockWeb3Service = { isConnected: true, account: mockAccount };
      onConnect(mockWeb3Service, mockAccount);
    } catch (err) {
      setError('Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 max-w-md w-full mx-auto shadow-2xl">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 animate-float">
          🚑
        </div>
        <h2 className="text-3xl font-black text-white mb-2">LifelineDAG</h2>
        <p className="text-blue-200">Emergency Response Platform</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl mb-4">
          ⚠️ {error}
        </div>
      )}

      <button
        onClick={handleConnect}
        disabled={loading}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 shadow-lg mb-4"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
            Connecting...
          </span>
        ) : (
          '🔗 Connect MetaMask'
        )}
      </button>

      {!window.ethereum && (
        <div className="text-center">
          <p className="text-blue-300 text-sm mb-2">Don't have MetaMask?</p>
          <a
            href="https://metamask.io/download.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:text-green-300 font-semibold text-sm"
          >
            Install MetaMask →
          </a>
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={onDisconnect}
          className="text-blue-300 hover:text-blue-200 text-sm"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default WalletConnect;