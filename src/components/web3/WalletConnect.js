import React, { useState } from 'react';
import Web3Service from '../../utils/web3.js';

const WalletConnect = ({ onConnect, onDisconnect }) => {
  const [web3Service] = useState(new Web3Service());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await web3Service.connectWallet();
      
      if (result.success) {
        onConnect(web3Service, result.account);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    onDisconnect();
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto glass-effect">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 animate-float">
          🚑
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">LifelineDAG</h2>
        <p className="text-gray-600">Decentralized Emergency Response Platform</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          ⚠️ {error}
        </div>
      )}

      {!web3Service.isConnected ? (
        <button
          onClick={handleConnect}
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 shadow-lg"
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
      ) : (
        <div className="text-center">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            ✅ Wallet Connected
          </div>
          <button
            onClick={handleDisconnect}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-xl font-semibold transition-colors"
          >
            Disconnect Wallet
          </button>
        </div>
      )}

      {!window.ethereum && (
        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm mb-2">Don't have MetaMask?</p>
          <a
            href="https://metamask.io/download.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Install MetaMask →
          </a>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;