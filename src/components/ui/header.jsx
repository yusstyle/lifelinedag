import React from 'react';
import { useWeb3 } from '../../context/Web3Context';

const Header = () => {
  const { account } = useWeb3();

  const truncateAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <header className="bg-white/5 backdrop-blur-lg border-b border-white/10 shadow-2xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-2xl shadow-blue-500/30">
              🌐
            </div>
            <div>
              <h1 className="text-2xl font-black text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                LIFELINEDAG
              </h1>
              <p className="text-blue-300 text-sm">Emergency Command Center</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-3 bg-green-500/20 border border-green-500/30 rounded-xl px-4 py-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-300 text-sm font-semibold">BlockDAG Online</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-6 py-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="text-right">
                  <p className="text-white text-sm font-semibold">Connected</p>
                  <p className="text-blue-300 text-xs font-mono">{truncateAddress(account)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-300">🔒 AES-256 Encryption Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-blue-300">🌐 Network Sync: 100%</span>
              </div>
            </div>
            <div className="text-blue-300">
              Emergency Mode: <span className="text-green-400 font-semibold">Ready</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;