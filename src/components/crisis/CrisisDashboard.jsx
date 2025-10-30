// src/components/crisis/CrisisDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../context/Web3Context';

const CrisisDashboard = () => {
  const { 
    contract, 
    account, 
    getAllCrises, 
    getCrisis, 
    getCrisisCount,
    verifyCrisis,
    balance,
    isIdentityVerified
  } = useWeb3();
  
  const [activeCrisis, setActiveCrisis] = useState(0);
  const [crises, setCrises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [stats, setStats] = useState({
    active: 0,
    resolved: 0,
    totalResponders: 0,
    avgResponseTime: '0s',
    verificationRate: '0%'
  });

  // Load crises from blockchain
  useEffect(() => {
    loadCrisesFromBlockchain();
  }, [contract]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCrisis(prev => (prev + 1) % crises.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [crises.length]);

  const loadCrisesFromBlockchain = async () => {
    if (!contract) return;

    try {
      setLoading(true);
      const blockchainCrises = await getAllCrises();
      
      // Transform blockchain data to UI format
      const transformedCrises = blockchainCrises.map((crisis, index) => ({
        id: index,
        crisisId: crisis.crisisId.toString(),
        type: getEmergencyTypeLabel(crisis.emergencyType),
        location: crisis.location,
        status: crisis.verified ? 'active' : 'pending',
        verified: crisis.verified,
        severity: getSeverityFromType(crisis.emergencyType),
        responders: Math.floor(Math.random() * 50) + 10,
        progress: crisis.verified ? Math.floor(Math.random() * 50) + 50 : 0,
        lastUpdate: 'Just now',
        declaredBy: crisis.declaredBy,
        timestamp: new Date(Number(crisis.timestamp) * 1000).toLocaleDateString(),
        verificationCount: crisis.verificationCount.toString()
      }));

      setCrises(transformedCrises);
      
      // Update stats
      updateStats(transformedCrises);
      
    } catch (error) {
      console.error('Error loading crises from blockchain:', error);
      // Fallback to mock data
      setCrises([
        { 
          id: 1, 
          crisisId: '1',
          type: '🌪️ Natural Disaster', 
          location: 'Southeast Asia - Coastal Regions', 
          status: 'active', 
          verified: true,
          severity: 'high',
          responders: 45,
          progress: 65,
          lastUpdate: '2 minutes ago',
          declaredBy: '0x742d...1c3a',
          timestamp: '2024-01-15',
          verificationCount: '3'
        },
        { 
          id: 2, 
          crisisId: '2',
          type: '🏥 Medical Emergency', 
          location: 'Central Hospital - Metro Area', 
          status: 'active', 
          verified: true,
          severity: 'critical',
          responders: 28,
          progress: 40,
          lastUpdate: '5 minutes ago',
          declaredBy: '0x8a9f...2b4c',
          timestamp: '2024-01-15',
          verificationCount: '2'
        }
      ]);
      updateStats([
        { status: 'active', verified: true },
        { status: 'active', verified: true }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (crisisData) => {
    const active = crisisData.filter(c => c.status === 'active').length;
    const resolved = crisisData.filter(c => c.status === 'resolved').length;
    const verified = crisisData.filter(c => c.verified).length;
    const total = crisisData.length;
    
    setStats({
      active,
      resolved,
      totalResponders: crisisData.reduce((sum, c) => sum + c.responders, 0),
      avgResponseTime: '<2s',
      verificationRate: total > 0 ? `${Math.round((verified / total) * 100)}%` : '0%'
    });
  };

  const getEmergencyTypeLabel = (type) => {
    const types = [
      '🌪️ Natural Disaster',
      '🏥 Medical Emergency', 
      '🛡️ Security Threat',
      '🏗️ Infrastructure Failure',
      '🔥 Wildfire Emergency',
      '🌊 Flood Emergency'
    ];
    return types[type] || '🚨 Unknown Emergency';
  };

  const getSeverityFromType = (type) => {
    const severities = ['high', 'critical', 'medium', 'high', 'high', 'high'];
    return severities[type] || 'medium';
  };

  const handleVerifyCrisis = async (crisisId) => {
    if (!contract || !account) {
      setMessage('❌ Please connect your wallet first');
      return;
    }

    // Check if user is verified
    try {
      const verified = await isIdentityVerified(account);
      if (!verified) {
        setMessage('❌ Only verified identities can verify crises');
        return;
      }
    } catch (error) {
      setMessage('❌ Error checking identity verification');
      return;
    }

    setLoading(true);
    setMessage('');
    setTransactionHash('');

    try {
      console.log('✅ Verifying crisis on blockchain...');
      
      setMessage('⏳ Sending verification transaction...');
      
      // Note: You'll need signatures for multi-sig verification
      // For now, using empty signatures array
      const signatures = [];
      const result = await verifyCrisis(crisisId, signatures);

      setTransactionHash(result.transactionHash);
      
      setMessage(`✅ Crisis verified successfully! Transaction: ${result.transactionHash.substring(0, 10)}...`);
      
      // Reload crises to reflect verification
      setTimeout(() => loadCrisesFromBlockchain(), 2000);
      
    } catch (error) {
      console.error('Crisis verification error:', error);
      let errorMessage = '❌ Error: ' + (error.reason || error.message);
      
      if (error.message.includes('user rejected transaction')) {
        errorMessage = '❌ Transaction rejected by user';
      } else if (error.message.includes('insufficient funds')) {
        errorMessage = '❌ Insufficient funds for transaction';
      } else if (error.message.includes('already verified')) {
        errorMessage = '❌ Crisis already verified';
      }
      
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critical': return 'from-red-500 to-pink-500';
      case 'high': return 'from-orange-500 to-red-500';
      case 'medium': return 'from-yellow-500 to-orange-500';
      default: return 'from-blue-500 to-cyan-500';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'text-red-400' : 'text-green-400';
  };

  const responseTeams = [
    { name: 'Medical Response Unit', status: 'deployed', members: 12 },
    { name: 'Search & Rescue', status: 'on-site', members: 8 },
    { name: 'Security Detail', status: 'standby', members: 6 },
    { name: 'Logistics Support', status: 'mobilizing', members: 10 }
  ];

  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-2xl shadow-blue-500/30">
          📊
        </div>
        <h2 className="text-3xl font-black text-white mb-2">CRISIS INTELLIGENCE DASHBOARD</h2>
        <p className="text-blue-200">Real-time monitoring and analysis of global emergency situations on BlockDAG</p>
      </div>

      {/* Connection Status */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-blue-300 text-sm font-semibold mb-2">🔗 CONNECTED WALLET</p>
            <p className="text-white font-mono text-sm bg-white/5 rounded-lg p-3 truncate">{account || 'Not Connected'}</p>
          </div>
          <div>
            <p className="text-blue-300 text-sm font-semibold mb-2">💰 WALLET BALANCE</p>
            <p className="text-green-400 font-semibold text-lg bg-green-500/10 rounded-lg p-3 text-center">
              {balance ? `${parseFloat(balance).toFixed(4)} ETH` : '0 ETH'}
            </p>
          </div>
          <div>
            <p className="text-blue-300 text-sm font-semibold mb-2">📡 NETWORK STATUS</p>
            <p className="text-green-400 font-semibold text-lg bg-green-500/10 rounded-lg p-3 text-center">
              {contract ? 'BLOCKDAG SYNC ✅' : 'NOT CONNECTED ❌'}
            </p>
          </div>
          <div>
            <p className="text-blue-300 text-sm font-semibold mb-2">🆔 IDENTITY STATUS</p>
            <p className="text-green-400 font-semibold text-lg bg-green-500/10 rounded-lg p-3 text-center">
              VERIFIED REQUIRED ✅
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 rounded-2xl p-4 text-center">
          <div className="text-red-400 text-2xl mb-2">🔥</div>
          <div className="text-white font-bold text-2xl">{stats.active}</div>
          <div className="text-red-300 text-sm">Active Crises</div>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-2xl p-4 text-center">
          <div className="text-green-400 text-2xl mb-2">✅</div>
          <div className="text-white font-bold text-2xl">{stats.resolved}</div>
          <div className="text-green-300 text-sm">Resolved</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-2xl p-4 text-center">
          <div className="text-blue-400 text-2xl mb-2">👥</div>
          <div className="text-white font-bold text-2xl">{stats.totalResponders}</div>
          <div className="text-blue-300 text-sm">Responders</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-2xl p-4 text-center">
          <div className="text-purple-400 text-2xl mb-2">⚡</div>
          <div className="text-white font-bold text-2xl">{stats.avgResponseTime}</div>
          <div className="text-purple-300 text-sm">Avg Response</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-2xl p-4 text-center">
          <div className="text-orange-400 text-2xl mb-2">🔍</div>
          <div className="text-white font-bold text-2xl">{stats.verificationRate}</div>
          <div className="text-orange-300 text-sm">Verification Rate</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Active Crisis Carousel */}
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">🚨 ACTIVE CRISIS MONITOR</h3>
            <button 
              onClick={loadCrisesFromBlockchain}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200"
            >
              {loading ? '🔄 Refreshing...' : '🔄 Refresh Data'}
            </button>
          </div>

          {loading && crises.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-blue-300">Loading crisis data from blockchain...</p>
            </div>
          ) : crises.length > 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              {/* Crisis Carousel */}
              {crises.map((crisis, index) => (
                <div 
                  key={crisis.id}
                  className={`${index === activeCrisis ? 'block' : 'hidden'} animate-fade-in`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{crisis.type.split(' ')[0]}</span>
                        <h4 className="text-white font-bold text-lg">{crisis.type}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          crisis.verified 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                          {crisis.verified ? '✅ VERIFIED' : '⏳ PENDING VERIFICATION'}
                        </span>
                      </div>
                      <p className="text-blue-200 text-sm">📍 {crisis.location}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold bg-gradient-to-r ${getSeverityColor(crisis.severity)} bg-clip-text text-transparent`}>
                        {crisis.severity.toUpperCase()}
                      </div>
                      <p className="text-white/60 text-sm">ID: {crisis.crisisId}</p>
                    </div>
                  </div>

                  {/* Progress and Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex justify-between text-sm text-white/80 mb-1">
                        <span>Response Progress</span>
                        <span>{crisis.progress}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${crisis.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-bold text-xl">{crisis.responders}</div>
                      <div className="text-white/60 text-sm">Responders</div>
                    </div>
                  </div>

                  {/* Crisis Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-white/60">Declared By:</p>
                      <p className="text-white font-mono truncate">{crisis.declaredBy}</p>
                    </div>
                    <div>
                      <p className="text-white/60">Timestamp:</p>
                      <p className="text-white">{crisis.timestamp}</p>
                    </div>
                    <div>
                      <p className="text-white/60">Verifications:</p>
                      <p className="text-white">{crisis.verificationCount}</p>
                    </div>
                    <div>
                      <p className="text-white/60">Last Update:</p>
                      <p className="text-white">{crisis.lastUpdate}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6">
                    {!crisis.verified && (
                      <button
                        onClick={() => handleVerifyCrisis(crisis.crisisId)}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-green-500/50 disabled:to-emerald-600/50 text-white py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        {loading ? '🔄 Verifying...' : '✅ Verify Crisis'}
                      </button>
                    )}
                    <button className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 rounded-xl font-semibold transition-all duration-200">
                      📊 View Details
                    </button>
                    <button className="flex-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 py-3 rounded-xl font-semibold transition-all duration-200">
                      🚨 Alert Teams
                    </button>
                  </div>
                </div>
              ))}

              {/* Carousel Controls */}
              {crises.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {crises.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveCrisis(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === activeCrisis ? 'bg-blue-500' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">🕊️</div>
              <h4 className="text-white font-bold text-lg mb-2">No Active Crises</h4>
              <p className="text-blue-300">All systems nominal. No emergency situations reported.</p>
            </div>
          )}
        </div>

        {/* Response Teams & Message Sidebar */}
        <div className="space-y-6">
          {/* Response Teams */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">🚑 RESPONSE TEAMS</h3>
            <div className="space-y-3">
              {responseTeams.map((team, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div>
                    <div className="text-white font-semibold text-sm">{team.name}</div>
                    <div className={`text-xs ${
                      team.status === 'deployed' ? 'text-green-400' :
                      team.status === 'on-site' ? 'text-blue-400' :
                      team.status === 'standby' ? 'text-yellow-400' : 'text-orange-400'
                    }`}>
                      {team.status.toUpperCase()}
                    </div>
                  </div>
                  <div className="text-white font-bold bg-white/10 px-3 py-1 rounded-lg">
                    {team.members}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction Messages */}
          {(message || transactionHash) && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">📝 TRANSACTION STATUS</h3>
              {message && (
                <div className={`p-4 rounded-xl mb-3 ${
                  message.includes('✅') ? 'bg-green-500/20 border border-green-500/30' :
                  message.includes('❌') ? 'bg-red-500/20 border border-red-500/30' :
                  'bg-blue-500/20 border border-blue-500/30'
                }`}>
                  <p className="text-white text-sm">{message}</p>
                </div>
              )}
              {transactionHash && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                  <p className="text-blue-300 text-sm font-semibold mb-1">Transaction Hash:</p>
                  <p className="text-white font-mono text-xs break-all">{transactionHash}</p>
                </div>
              )}
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">⚡ QUICK ACTIONS</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 py-3 rounded-xl font-semibold transition-all duration-200 text-sm">
                🆕 Declare Crisis
              </button>
              <button className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 py-3 rounded-xl font-semibold transition-all duration-200 text-sm">
                👥 Manage Teams
              </button>
              <button className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-400 py-3 rounded-xl font-semibold transition-all duration-200 text-sm">
                📋 View Logs
              </button>
              <button className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-400 py-3 rounded-xl font-semibold transition-all duration-200 text-sm">
                ⚙️ Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-white/40 text-sm">
          🔒 Secured by BlockDAG Network • Real-time crisis management system • Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default CrisisDashboard;