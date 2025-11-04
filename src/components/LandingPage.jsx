// src/components/LandingPage.jsx - CREATE THIS FILE
import React from 'react';

const LandingPage = ({ onConnect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white">
      {/* Navigation */}
      <nav className="py-6 px-8 bg-blue-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-3xl font-bold text-white">LIFELINEDAG</div>
          <button 
            onClick={onConnect}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Launch App
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-8">
        <div className="text-center space-y-8">
          <h1 className="text-6xl font-bold text-white">
            INTELLIGENCE SECURITY &{' '}
            <span className="text-blue-300">EMERGENCY RESPONSE</span>
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            World's first AI-powered, blockchain-secured emergency coordination platform
          </p>
          
          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center mt-8">
            <button 
              onClick={onConnect}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105"
            >
              🚀 Launch Emergency Dashboard
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 border border-white/20">
              📚 Learn More
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              { icon: '🛡️', title: 'Zero-Trust', desc: 'Military-grade encryption' },
              { icon: '🌐', title: 'Global Network', desc: 'Real-time synchronization' },
              { icon: '🚨', title: 'AI-Powered', desc: 'Machine learning optimization' }
            ].map((feature, index) => (
              <div key={index} className="bg-blue-800/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/20 hover:scale-105 transition-transform duration-300">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                <p className="text-blue-200">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900/50 py-8 border-t border-blue-700/30">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-blue-300">
            🔒 Secured by BlockDAG Network • Global Emergency Response System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;