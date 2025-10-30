// src/components/LandingPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useWeb3 } from '../context/Web3Context';

const AnimatedEarth = () => {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let rotation = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawEarth = (time) => {
      rotation += 0.002;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw animated stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      for (let i = 0; i < 200; i++) {
        const x = (Math.sin(i * 123.456 + time * 0.0001) * 0.5 + 0.5) * canvas.width;
        const y = (Math.cos(i * 321.654 + time * 0.0001) * 0.5 + 0.5) * canvas.height;
        const size = Math.sin(i * 100 + time * 0.001) * 1.5 + 1;
        const opacity = Math.sin(time * 0.001 + i) * 0.5 + 0.5;
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.25;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);

      // Earth glow
      const glow = ctx.createRadialGradient(0, 0, radius * 0.8, 0, 0, radius * 1.5);
      glow.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
      glow.addColorStop(1, 'rgba(59, 130, 246, 0)');
      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // Earth sphere with dynamic lighting
      const gradient = ctx.createRadialGradient(
        -radius * 0.3, -radius * 0.3, radius * 0.1,
        0, 0, radius
      );
      gradient.addColorStop(0, '#1e40af');
      gradient.addColorStop(0.3, '#3b82f6');
      gradient.addColorStop(0.7, '#1e3a8a');
      gradient.addColorStop(1, '#1e1b4b');

      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Animated continents
      ctx.fillStyle = '#10b981';
      
      // Africa with animation
      ctx.beginPath();
      const africaScale = 1 + Math.sin(time * 0.001) * 0.05;
      ctx.ellipse(-radius * 0.2, -radius * 0.1, radius * 0.3 * africaScale, radius * 0.4 * africaScale, 0.3, 0, Math.PI * 2);
      ctx.fill();
      
      // Americas
      ctx.beginPath();
      ctx.ellipse(radius * 0.3, 0, radius * 0.4, radius * 0.5, -0.2, 0, Math.PI * 2);
      ctx.fill();
      
      // Asia
      ctx.beginPath();
      ctx.ellipse(-radius * 0.4, radius * 0.2, radius * 0.5, radius * 0.4, -0.1, 0, Math.PI * 2);
      ctx.fill();

      // Animated clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let i = 0; i < 8; i++) {
        const cloudX = Math.sin(time * 0.0005 + i * 0.8) * radius * 0.8;
        const cloudY = Math.cos(time * 0.0007 + i * 0.6) * radius * 0.7;
        const cloudSize = radius * 0.1 + Math.sin(time * 0.001 + i) * radius * 0.05;
        
        ctx.beginPath();
        ctx.arc(cloudX, cloudY, cloudSize, 0, Math.PI * 2);
        ctx.arc(cloudX + cloudSize * 0.8, cloudY, cloudSize * 0.7, 0, Math.PI * 2);
        ctx.arc(cloudX - cloudSize * 0.8, cloudY, cloudSize * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }

      // Data flow particles (representing network)
      ctx.fillStyle = '#60a5fa';
      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2 + time * 0.0002;
        const particleRadius = radius * 1.8 + Math.sin(time * 0.001 + i) * radius * 0.2;
        const x = Math.cos(angle) * particleRadius;
        const y = Math.sin(angle) * particleRadius;
        const size = 2 + Math.sin(time * 0.005 + i) * 1;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      frameRef.current = requestAnimationFrame(drawEarth);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    frameRef.current = requestAnimationFrame(drawEarth);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-15"
    />
  );
};

const FloatingParticles = () => {
  const particlesRef = useRef([]);

  useEffect(() => {
    particlesRef.current = Array.from({ length: 50 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particlesRef.current.map((particle, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-blue-400 animate-pulse"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            animationDelay: `${i * 0.1}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay }) => (
  <div 
    className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 hover:scale-105 transition-all duration-500 hover:border-blue-500/50 group cursor-pointer"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-2xl font-black text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text">
      {title}
    </h3>
    <p className="text-blue-200 leading-relaxed">
      {description}
    </p>
  </div>
);

const LandingPage = () => {
  const { connectWallet, isLoading, error } = useWeb3();
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: '🛡️',
      title: 'Zero-Trust Architecture',
      description: 'Military-grade AES-256 encryption with quantum-resistant algorithms and multi-party computation'
    },
    {
      icon: '🌐',
      title: 'Global BlockDAG Network',
      description: 'Real-time synchronization across 200+ countries with <100ms latency and 99.99% uptime'
    },
    {
      icon: '🚨',
      title: 'AI-Powered Response',
      description: 'Machine learning algorithms predict and optimize emergency resource allocation in real-time'
    },
    {
      icon: '🔐',
      title: 'Identity Verification',
      description: 'Biometric and multi-factor authentication for verified responders with government certification'
    },
    {
      icon: '📡',
      title: 'Satellite Integration',
      description: 'Direct satellite communication for remote and disaster-struck areas with offline capability'
    },
    {
      icon: '🤖',
      title: 'Autonomous Drones',
      description: 'AI-controlled drone fleet for rapid assessment and emergency delivery in crisis zones'
    }
  ];

  const stats = [
    { number: '2.5B', label: 'People Protected', icon: '👥' },
    { number: '150+', label: 'Countries Active', icon: '🌍' },
    { number: '50K+', label: 'Responders', icon: '🦺' },
    { number: '99.99%', label: 'Uptime', icon: '⚡' }
  ];

  const useCases = [
    {
      icon: '🌪️',
      title: 'Natural Disasters',
      description: 'Hurricane, earthquake, and flood response coordination',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: '🏥',
      title: 'Medical Emergencies',
      description: 'Pandemic response and medical supply chain management',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: '🛡️',
      title: 'Security Crises',
      description: 'Conflict zones and national security threat management',
      color: 'from-yellow-500 to-amber-500'
    },
    {
      icon: '🔥',
      title: 'Wildfire Response',
      description: 'Real-time fire tracking and evacuation coordination',
      color: 'from-red-500 to-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 overflow-hidden relative">
      {/* Advanced Background Elements */}
      <AnimatedEarth />
      <FloatingParticles />
      
      {/* Animated Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

      {/* Navigation */}
      <nav className="relative z-50 py-6 px-8 backdrop-blur-md bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-2xl shadow-blue-500/30 animate-pulse-slow">
              🌐
            </div>
            <div>
              <div className="text-3xl font-black text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                LIFELINEDAG
              </div>
              <div className="text-blue-300 text-sm font-medium">Global Emergency Network</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="text-white/80 hover:text-white transition-colors font-medium">
              Documentation
            </button>
            <button className="text-white/80 hover:text-white transition-colors font-medium">
              Use Cases
            </button>
            <button
              onClick={connectWallet}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50 disabled:opacity-50 flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Launch App</span>
                </>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-8 pt-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className={`space-y-8 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            
            {/* Animated Badge */}
            <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-6 py-3 mb-8 animate-pulse-glow">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-ping" />
              <span className="text-white font-semibold text-lg">🌐 LIVE - GLOBAL NETWORK ACTIVE</span>
            </div>

            {/* Main Heading with Typing Effect */}
            <h1 className="text-6xl md:text-8xl font-black text-white leading-tight">
              INTELLIGENCE SECURITY &
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
                EMERGENCY RESPONSE
              </span>
            </h1>

            {/* Animated Subheading */}
            <p className="text-2xl text-blue-200 max-w-4xl mx-auto leading-relaxed font-light">
              World's first <span className="text-white font-semibold">AI-powered, blockchain-secured</span> emergency coordination platform connecting governments, NGOs, and first responders globally
            </p>

            {/* Animated CTA Section */}
            <div className="pt-12 space-y-8">
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button
                  onClick={connectWallet}
                  disabled={isLoading}
                  className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-2xl text-xl font-semibold transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50 disabled:opacity-50 overflow-hidden animate-bounce-gentle"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <span className="relative z-10 flex items-center justify-center space-x-3">
                    {isLoading ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Initializing Secure Connection...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl">⚡</span>
                        <span>DEPLOY EMERGENCY DASHBOARD</span>
                      </>
                    )}
                  </span>
                </button>

                <button className="group bg-white/10 backdrop-blur-lg border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300 transform hover:scale-105 overflow-hidden">
                  <span className="flex items-center space-x-2">
                    <span>📊</span>
                    <span>View Live Demo</span>
                  </span>
                </button>
              </div>

              {/* Animated Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className="text-center transform hover:scale-110 transition-transform duration-300"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="text-4xl mb-2 animate-bounce-slow">{stat.icon}</div>
                    <div className="text-3xl font-black text-white mb-1">
                      {stat.number}
                    </div>
                    <div className="text-blue-300 text-sm font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Carousel */}
      <section className="relative py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                NEXT-GENERATION
              </span>
              <br />
              TECHNOLOGY STACK
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Feature Showcase */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {features.map((feature, index) => (
                  <FeatureCard
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    delay={index * 100}
                  />
                ))}
              </div>
            </div>

            {/* Use Cases Sidebar */}
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-white mb-6">GLOBAL USE CASES</h3>
              {useCases.map((useCase, index) => (
                <div
                  key={index}
                  className="group bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`text-3xl transform group-hover:scale-110 transition-transform duration-300`}>
                      {useCase.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-2">
                        {useCase.title}
                      </h4>
                      <p className="text-blue-200 text-sm">
                        {useCase.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-16 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse" />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl animate-ping-slow" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl animate-ping-slower" />
            
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 relative z-10">
              READY TO DEPLOY
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                GLOBAL PROTECTION?
              </span>
            </h2>
            
            <p className="text-xl text-blue-200 mb-8 relative z-10 max-w-2xl mx-auto">
              Join 150+ governments and 500+ NGOs in securing emergency response for 2.5 billion people worldwide
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center relative z-10">
              <button
                onClick={connectWallet}
                disabled={isLoading}
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-2xl text-lg font-semibold transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50 disabled:opacity-50 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="relative z-10 flex items-center justify-center space-x-3">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>SECURE CONNECTION...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl">🌍</span>
                      <span>ACTIVATE GLOBAL NETWORK</span>
                    </>
                  )}
                </span>
              </button>

              <button className="group bg-white/10 backdrop-blur-lg border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300 transform hover:scale-105 overflow-hidden">
                <span className="flex items-center space-x-2">
                  <span>📞</span>
                  <span>Schedule Demo</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-8 border-t border-white/10 bg-white/5 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
                  🌐
                </div>
                <div className="text-xl font-black text-white">LIFELINEDAG</div>
              </div>
              <p className="text-blue-200 text-sm">
                Securing global emergency response through cutting-edge blockchain technology
              </p>
            </div>
            
            {['Product', 'Solutions', 'Developers', 'Company'].map((category, index) => (
              <div key={index}>
                <h4 className="text-white font-semibold mb-4">{category}</h4>
                <div className="space-y-2 text-blue-200 text-sm">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="hover:text-white cursor-pointer transition-colors">
                      Link {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-blue-200 text-sm">
            © 2024 LifelineDAG Global Emergency Network. All rights secured.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;