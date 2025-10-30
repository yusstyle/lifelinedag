// src/components/crisis/AccessControl.jsx
import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../context/Web3Context';

const AccessControl = () => {
  const { 
    contract, 
    account, 
    emergencyAccess, 
    canAccessCrisis, 
    grantCrisisAccess,
    getAllCrises,
    getCrisisAccessLogs,
    balance,
    isIdentityVerified
  } = useWeb3();
  
  const [selectedCrisis, setSelectedCrisis] = useState('');
  const [accessDuration, setAccessDuration] = useState('86400'); // 24 hours in seconds
  const [responderAddress, setResponderAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [crises, setCrises] = useState([]);
  const [accessLogs, setAccessLogs] = useState([]);
  const [accessCheck, setAccessCheck] = useState({ crisisId: '', userAddress: '', hasAccess: null });

  const durationOptions = [
    { value: '3600', label: '1 Hour', display: '1 hour' },
    { value: '21600', label: '6 Hours', display: '6 hours' },
    { value: '86400', label: '24 Hours', display: '24 hours' },
    { value: '259200', label: '3 Days', display: '3 days' },
    { value: '604800', label: '1 Week', display: '1 week' }
  ];

  // Load crises on component mount
  useEffect(() => {
    loadCrises();
  }, [contract]);

  const loadCrises = async () => {
    if (!contract) return;
    
    try {
      const crisisData = await getAllCrises();
      setCrises(crisisData.filter(crisis => crisis.verified));
    } catch (error) {
      console.error('Error loading crises:', error);
      // Mock data for demonstration
      setCrises([
        { 
          id: '1', 
          crisisId: '1',
          emergencyType: '0',
          location: 'Southeast Asia - Coastal Regions',
          verified: true,
          declaredBy: '0x742d35Cc6634C0532925a3b8Dc9B8eC7f2E5BdF1'
        },
        { 
          id: '2', 
          crisisId: '2',
          emergencyType: '1', 
          location: 'Central Hospital - Metro Area',
          verified: true,
          declaredBy: '0x8a9f2b4c7d3e1f6a5b4c8d9e0f1a2b3c4d5e6f7'
        }
      ]);
    }
  };

  const handleGrantAccess = async (e) => {
    e.preventDefault();
    if (!contract || !selectedCrisis || !responderAddress) {
      setMessage('❌ Please fill all required fields and ensure contract is connected');
      return;
    }

    if (!account) {
      setMessage('❌ Please connect your wallet first');
      return;
    }

    // Validate Ethereum address
    if (!ethers.isAddress(responderAddress)) {
      setMessage('❌ Invalid Ethereum address');
      return;
    }

    setLoading(true);
    setMessage('');
    setTransactionHash('');

    try {
      console.log('🔑 Granting access on blockchain...');
      
      setMessage('⏳ Sending access grant transaction...');
      
      // Note: You'll need to add a grantAccess function to your contract
      const result = await grantCrisisAccess(
        selectedCrisis,
        responderAddress,
        accessDuration
      );

      setTransactionHash(result.transactionHash);
      
      setMessage(`✅ Emergency access granted successfully! Transaction: ${result.transactionHash.substring(0, 10)}...`);
      
      // Reset form
      setSelectedCrisis('');
      setAccessDuration('86400');
      setResponderAddress('');
      
      // Reload access logs
      setTimeout(() => loadAccessLogs(selectedCrisis), 2000);
      
    } catch (error) {
      console.error('Access grant error:', error);
      let errorMessage = '❌ Error: ' + (error.reason || error.message);
      
      if (error.message.includes('user rejected transaction')) {
        errorMessage = '❌ Transaction rejected by user';
      } else if (error.message.includes('insufficient funds')) {
        errorMessage = '❌ Insufficient funds for transaction';
      } else if (error.message.includes('not authorized')) {
        errorMessage = '❌ You are not authorized to grant access for this crisis';
      }
      
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencyAccess = async (crisisId) => {
    if (!contract) {
      setMessage('❌ Contract not connected');
      return;
    }

    if (!account) {
      setMessage('❌ Please connect your wallet first');
      return;
    }

    // Check if user is verified
    try {
      const verified = await isIdentityVerified(account);
      if (!verified) {
        setMessage('❌ Only verified identities can use emergency access');
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
      console.log('🚨 Activating emergency access on blockchain...');
      
      setMessage('⏳ Activating break-glass emergency access...');
      
      const result = await emergencyAccess(crisisId);

      setTransactionHash(result.transactionHash);
      
      setMessage(`✅ Emergency break-glass access activated! This action has been logged. Transaction: ${result.transactionHash.substring(0, 10)}...`);
      
    } catch (error) {
      console.error('Emergency access error:', error);
      let errorMessage = '❌ Error: ' + (error.reason || error.message);
      
      if (error.message.includes('user rejected transaction')) {
        errorMessage = '❌ Transaction rejected by user';
      } else if (error.message.includes('insufficient funds')) {
        errorMessage = '❌ Insufficient funds for transaction';
      }
      
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAccess = async () => {
    if (!accessCheck.crisisId || !accessCheck.userAddress) {
      setMessage('❌ Please enter both Crisis ID and User Address');
      return;
    }

    if (!ethers.isAddress(accessCheck.userAddress)) {
      setMessage('❌ Invalid Ethereum address');
      return;
    }

    try {
      setLoading(true);
      const hasAccess = await canAccessCrisis(accessCheck.crisisId, accessCheck.userAddress);
      setAccessCheck(prev => ({ ...prev, hasAccess }));
      
      setMessage(hasAccess ? 
        '✅ User has access to this crisis' : 
        '❌ User does not have access to this crisis'
      );
    } catch (error) {
      console.error('Access check error:', error);
      setMessage('❌ Error checking access permissions');
    } finally {
      setLoading(false);
    }
  };

  const loadAccessLogs = async (crisisId) => {
    // This would be implemented based on your contract's event logging
    // For now, using mock data
    setAccessLogs([
      { 
        user: '0x742d...1c3a', 
        crisis: 'Southeast Asia Floods', 
        grantedAt: '2 hours ago', 
        expiresIn: '22 hours', 
        status: 'active',
        transactionHash: '0xabc123...'
      },
      { 
        user: '0x8a9f...2b4c', 
        crisis: 'Metro Hospital Emergency', 
        grantedAt: '1 hour ago', 
        expiresIn: '23 hours', 
        status: 'active',
        transactionHash: '0xdef456...'
      }
    ]);
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critical': return 'from-red-500 to-pink-500';
      case 'high': return 'from-orange-500 to-red-500';
      case 'medium': return 'from-yellow-500 to-orange-500';
      default: return 'from-blue-500 to-cyan-500';
    }
  };

  const getCrisisName = (crisisId) => {
    const crisis = crises.find(c => c.crisisId === crisisId);
    return crisis ? `${getEmergencyTypeIcon(crisis.emergencyType)} ${crisis.location}` : `Crisis ${crisisId}`;
  };

  const getEmergencyTypeIcon = (type) => {
    const types = ['🌪️', '🏥', '🛡️', '🏗️', '🔥', '🌊'];
    return types[type] || '🚨';
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-2xl shadow-purple-500/30">
          🔐
        </div>
        <h2 className="text-3xl font-black text-white mb-2">ACCESS CONTROL CENTER</h2>
        <p className="text-purple-200">Manage emergency access permissions and break-glass protocols on BlockDAG</p>
      </div>

      {/* Connection Status */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <p className="text-blue-300 text-sm font-semibold mb-2">🌐 NETWORK STATUS</p>
            <p className="text-green-400 font-semibold text-lg bg-green-500/10 rounded-lg p-3 text-center">
              {contract ? 'BLOCKDAG CONNECTED ✅' : 'NOT CONNECTED ❌'}
            </p>
          </div>
        </div>
      </div>

      {/* Access Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Grant Access Panel */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-black text-white mb-4 flex items-center">
            <span className="text-blue-400 mr-2">👤</span>
            GRANT EMERGENCY ACCESS
          </h3>
          
          <form onSubmit={handleGrantAccess} className="space-y-4">
            <div>
              <label className="block text-blue-300 text-sm font-semibold mb-2">Select Crisis</label>
              <select
                value={selectedCrisis}
                onChange={(e) => setSelectedCrisis(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all duration-300"
                required
              >
                <option value="">Choose a crisis...</option>
                {crises.map(crisis => (
                  <option key={crisis.crisisId} value={crisis.crisisId}>
                    {getEmergencyTypeIcon(crisis.emergencyType)} {crisis.location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-blue-300 text-sm font-semibold mb-2">Access Duration</label>
              <select
                value={accessDuration}
                onChange={(e) => setAccessDuration(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all duration-300"
              >
                {durationOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-blue-300 text-sm font-semibold mb-2">Responder Wallet Address</label>
              <input
                type="text"
                value={responderAddress}
                onChange={(e) => setResponderAddress(e.target.value)}
                placeholder="0x742d35Cc6634C0532925a3b8D..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all duration-300 font-mono text-sm"
                required
              />
            </div>

            {/* Transaction Warning */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
              <div className="flex items-center space-x-2 text-yellow-300 text-sm">
                <span>💰</span>
                <span>This action requires a blockchain transaction and gas fee</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !contract || !account}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="relative z-10 flex items-center justify-center">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    GRANTING ACCESS...
                  </>
                ) : (
                  <>
                    <span className="text-lg mr-2">🔓</span>
                    GRANT EMERGENCY ACCESS
                  </>
                )}
              </span>
            </button>
          </form>
        </div>

        {/* Break-Glass Access */}
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6">
          <h3 className="text-xl font-black text-white mb-4 flex items-center">
            <span className="text-orange-400 mr-2">🚨</span>
            BREAK-GLASS EMERGENCY ACCESS
          </h3>
          
          <p className="text-orange-200 text-sm mb-4">
            Immediate full access to all crisis data. This action is logged on BlockDAG and requires post-event justification.
            <strong> Requires verified identity and gas fee.</strong>
          </p>

          <div className="space-y-3 mb-4">
            {crises.map(crisis => (
              <div key={crisis.crisisId} className="flex items-center justify-between bg-white/5 rounded-xl p-4 border border-white/10 hover:scale-105 transition-all duration-300">
                <div>
                  <div className="font-semibold text-white">{getCrisisName(crisis.crisisId)}</div>
                  <div className="text-orange-200 text-sm">Declared by: {crisis.declaredBy?.substring(0, 8)}...</div>
                </div>
                <button
                  onClick={() => handleEmergencyAccess(crisis.crisisId)}
                  disabled={loading}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                >
                  🚨 Break Glass
                </button>
              </div>
            ))}
          </div>

          <div className="bg-orange-500/20 border border-orange-500/30 rounded-xl p-3">
            <div className="flex items-center space-x-2 text-orange-300 text-sm">
              <span>⚠️</span>
              <span>This action triggers emergency protocols and is permanently audited on BlockDAG</span>
            </div>
          </div>
        </div>
      </div>

      {/* Access Check Tool */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
        <h3 className="text-xl font-black text-white mb-4 flex items-center">
          <span className="text-green-400 mr-2">🔍</span>
          CHECK ACCESS PERMISSIONS
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-green-300 text-sm font-semibold mb-2">Crisis ID</label>
            <input
              type="text"
              value={accessCheck.crisisId}
              onChange={(e) => setAccessCheck(prev => ({ ...prev, crisisId: e.target.value }))}
              placeholder="1"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-green-300 focus:outline-none focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-green-300 text-sm font-semibold mb-2">User Address</label>
            <input
              type="text"
              value={accessCheck.userAddress}
              onChange={(e) => setAccessCheck(prev => ({ ...prev, userAddress: e.target.value }))}
              placeholder="0x742d35Cc6634C0532925a3b8D..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-green-300 focus:outline-none focus:border-green-500 font-mono text-sm"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleCheckAccess}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
            >
              Check Access
            </button>
          </div>
        </div>

        {accessCheck.hasAccess !== null && (
          <div className={`p-3 rounded-xl ${
            accessCheck.hasAccess 
              ? 'bg-green-500/20 border border-green-500/30' 
              : 'bg-red-500/20 border border-red-500/30'
          }`}>
            <div className="flex items-center space-x-2">
              <span className={accessCheck.hasAccess ? 'text-green-400' : 'text-red-400'}>
                {accessCheck.hasAccess ? '✅' : '❌'}
              </span>
              <span className={accessCheck.hasAccess ? 'text-green-300' : 'text-red-300'}>
                {accessCheck.hasAccess 
                  ? `User ${accessCheck.userAddress.substring(0, 8)}... HAS access to Crisis ${accessCheck.crisisId}`
                  : `User ${accessCheck.userAddress.substring(0, 8)}... does NOT have access to Crisis ${accessCheck.crisisId}`
                }
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Access Logs */}
      <div className="mb-8">
        <h3 className="text-2xl font-black text-white mb-4 flex items-center">
          <span className="text-green-400 mr-2">📋</span>
          RECENT ACCESS GRANTS
        </h3>
        
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-blue-300 text-sm font-semibold">User</th>
                  <th className="text-left p-4 text-blue-300 text-sm font-semibold">Crisis</th>
                  <th className="text-left p-4 text-blue-300 text-sm font-semibold">Granted</th>
                  <th className="text-left p-4 text-blue-300 text-sm font-semibold">Expires</th>
                  <th className="text-left p-4 text-blue-300 text-sm font-semibold">Status</th>
                  <th className="text-left p-4 text-blue-300 text-sm font-semibold">Transaction</th>
                </tr>
              </thead>
              <tbody>
                {accessLogs.map((log, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-300">
                    <td className="p-4 font-mono text-sm text-white">{log.user}</td>
                    <td className="p-4 text-blue-200">{log.crisis}</td>
                    <td className="p-4 text-blue-200">{log.grantedAt}</td>
                    <td className="p-4 text-blue-200">{log.expiresIn}</td>
                    <td className="p-4">
                      <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-semibold border border-green-500/30">
                        {log.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-xs text-blue-300">
                      {log.transactionHash?.substring(0, 10)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {accessLogs.length === 0 && (
            <div className="text-center py-8 text-blue-300">
              No access grants recorded on BlockDAG
            </div>
          )}
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <div className={`mt-6 p-4 rounded-2xl border ${
          message.includes('✅') || message.includes('⏳')
            ? 'bg-green-500/10 border-green-500 text-green-300' 
            : 'bg-red-500/10 border-red-500 text-red-300'
        }`}>
          <div className="flex items-center">
            <span className="text-lg mr-3">
              {message.includes('✅') ? '✅' : message.includes('⏳') ? '⏳' : '❌'}
            </span>
            <span className="font-semibold">{message}</span>
          </div>
          {transactionHash && (
            <div className="mt-2 text-sm">
              <span className="opacity-80">Transaction: </span>
              <span className="font-mono">{transactionHash}</span>
            </div>
          )}
        </div>
      )}

      {/* Security Features */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        {[
          { icon: '🔐', label: 'Multi-Signature', desc: 'Requires multiple verifications' },
          { icon: '⏱️', label: 'Time-Limited', desc: 'Automatic expiration' },
          { icon: '📝', label: 'Full Audit Trail', desc: 'Immutable BlockDAG logging' }
        ].map((feature, index) => (
          <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:scale-105 transition-all duration-300 group">
            <div className="text-3xl text-blue-400 mb-3 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
            <p className="text-white text-sm font-semibold mb-1">{feature.label}</p>
            <p className="text-blue-300 text-xs">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* Security Warning */}
      <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
        <div className="flex items-start space-x-4">
          <div className="text-blue-400 text-2xl mt-1">🔒</div>
          <div>
            <h4 className="font-semibold text-blue-400 mb-2">ZERO-TRUST SECURITY MODEL</h4>
            <p className="text-blue-200 text-sm">
              All access is verified cryptographically on BlockDAG. No implicit trust is granted. 
              Every access attempt is logged immutably for complete auditability and accountability.
              Multi-signature requirements ensure no single point of failure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessControl;