import React from 'react';
import { Web3Provider } from './context/Web3Context';
import LandingPage from './components/LandingPage';
import Header from './components/ui/Header';
import Dashboard from './components/crisis/Dashboard';
import { useWeb3 } from './context/Web3Context';

const AppContent = () => {
  const { isConnected, isLoading, error } = useWeb3();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Connecting to BlockDAG Network...</h2>
          <p className="text-blue-300">Establishing secure encrypted connection</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 max-w-md text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-4">Connection Error</h2>
          <p className="text-red-300 mb-6 bg-red-900/30 p-4 rounded-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {isConnected ? (
        <>
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Dashboard />
          </main>
        </>
      ) : (
        <LandingPage />
      )}
    </div>
  );
};

function App() {
  return (
    <Web3Provider>
      <AppContent />
    </Web3Provider>
  );
}

export default App;