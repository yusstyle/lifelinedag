// src/components/crisis/IdentityRegister.jsx
import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../context/Web3Context';

const IdentityRegister = () => {
  const { contract, account, registerIdentity, getIdentity, isIdentityVerified, balance } = useWeb3();
  const [formData, setFormData] = useState({
    did: '',
    sector: '0',
    metadataURI: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [userIdentity, setUserIdentity] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');

  const sectors = [
    { value: '0', label: '🏥 Healthcare & Medical' },
    { value: '1', label: '🛡️ Security & Defense' },
    { value: '2', label: '🏛️ Government Agency' },
    { value: '3', label: '🤝 NGO & Humanitarian' },
    { value: '4', label: '👥 Volunteer Responder' },
    { value: '5', label: '🔬 Research & Academia' }
  ];

  // Load user identity on component mount
  useEffect(() => {
    loadUserIdentity();
  }, [account, contract]);

  const loadUserIdentity = async () => {
    if (!contract || !account) return;
    
    try {
      const identity = await getIdentity(account);
      if (identity && identity.wallet !== ethers.ZeroAddress) {
        setUserIdentity(identity);
        const verified = await isIdentityVerified(account);
        setIsVerified(verified);
      }
    } catch (error) {
      console.log('No identity found or error loading:', error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!contract) {
      setMessage('❌ Contract not connected');
      return;
    }

    if (!account) {
      setMessage('❌ Please connect your wallet first');
      return;
    }

    setLoading(true);
    setMessage('');
    setTransactionHash('');

    try {
      console.log('Starting identity registration on blockchain...');
      
      // Validate DID format
      if (!formData.did.startsWith('did:')) {
        throw new Error('DID must start with "did:" prefix');
      }

      setMessage('⏳ Sending transaction to blockchain...');
      
      const result = await registerIdentity(
        formData.did,
        parseInt(formData.sector),
        formData.metadataURI || ""
      );

      setTransactionHash(result.transactionHash);
      
      setMessage(`✅ Identity registered successfully on BlockDAG! Transaction: ${result.transactionHash.substring(0, 10)}...`);
      
      // Reset form
      setFormData({ did: '', sector: '0', metadataURI: '' });
      
      // Reload user identity
      setTimeout(() => loadUserIdentity(), 2000);
      
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = '❌ Error: ' + (error.reason || error.message);
      
      // User-friendly error messages
      if (error.message.includes('user rejected transaction')) {
        errorMessage = '❌ Transaction rejected by user';
      } else if (error.message.includes('insufficient funds')) {
        errorMessage = '❌ Insufficient funds for transaction';
      } else if (error.message.includes('already registered')) {
        errorMessage = '❌ Identity already registered for this wallet';
      }
      
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-2xl shadow-blue-500/30">
          🚀
        </div>
        <h2 className="text-3xl font-black text-white mb-2">IDENTITY REGISTRATION</h2>
        <p className="text-blue-200">Register as a verified emergency responder on the global BlockDAG network</p>
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
            <p className="text-blue-300 text-sm font-semibold mb-2">✅ VERIFICATION STATUS</p>
            <p className={`font-semibold text-lg rounded-lg p-3 text-center ${
              isVerified 
                ? 'bg-green-500/20 text-green-300' 
                : userIdentity 
                  ? 'bg-yellow-500/20 text-yellow-300'
                  : 'bg-red-500/20 text-red-300'
            }`}>
              {isVerified ? 'VERIFIED ✅' : userIdentity ? 'PENDING VERIFICATION' : 'NOT REGISTERED'}
            </p>
          </div>
        </div>
      </div>

      {/* Existing Identity Display */}
      {userIdentity && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-black text-green-400 mb-4">📋 EXISTING IDENTITY</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-green-300">DID:</span>
              <p className="text-white font-mono">{userIdentity.did}</p>
            </div>
            <div>
              <span className="text-green-300">Sector:</span>
              <p className="text-white">{sectors.find(s => s.value === userIdentity.sector.toString())?.label}</p>
            </div>
            <div>
              <span className="text-green-300">Registered:</span>
              <p className="text-white">{new Date(Number(userIdentity.registrationDate) * 1000).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-green-300">Status:</span>
              <p className="text-white">{userIdentity.verified ? 'Verified ✅' : 'Pending Review ⏳'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Registration Form */}
      {!userIdentity && (
        <form onSubmit={handleRegister} className="space-y-6">
          {/* DID Field */}
          <div>
            <label className="block text-blue-300 text-sm font-semibold mb-3">
              🌐 DECENTRALIZED IDENTIFIER (DID)
            </label>
            <input
              type="text"
              name="did"
              value={formData.did}
              onChange={handleChange}
              placeholder="did:ethr:0x1234abcd..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-blue-300 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all duration-300"
              required
            />
            <p className="text-blue-400 text-xs mt-2">Your unique decentralized identifier for emergency response operations</p>
          </div>

          {/* Sector Selection */}
          <div>
            <label className="block text-blue-300 text-sm font-semibold mb-3">
              🏢 RESPONSE SECTOR
            </label>
            <select
              name="sector"
              value={formData.sector}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all duration-300"
            >
              {sectors.map(sector => (
                <option key={sector.value} value={sector.value}>
                  {sector.label}
                </option>
              ))}
            </select>
            <p className="text-blue-400 text-xs mt-2">Select your primary emergency response category for proper coordination</p>
          </div>

          {/* Metadata URI */}
          <div>
            <label className="block text-blue-300 text-sm font-semibold mb-3">
              📄 VERIFICATION DOCUMENTS (Optional)
            </label>
            <input
              type="text"
              name="metadataURI"
              value={formData.metadataURI}
              onChange={handleChange}
              placeholder="ipfs://Qm... or https://credentials.org/..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-blue-300 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all duration-300"
            />
            <p className="text-blue-400 text-xs mt-2">IPFS hash or URL for additional credentials, certifications, and verification documents</p>
          </div>

          {/* Transaction Cost Warning */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <span className="text-yellow-400 text-lg">⚠️</span>
              <div>
                <p className="text-yellow-300 font-semibold">Blockchain Transaction Required</p>
                <p className="text-yellow-200 text-sm">This action will require a small gas fee to register your identity on the BlockDAG network</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !contract || !account}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-2xl font-black text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <span className="relative z-10 flex items-center justify-center">
              {loading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  REGISTERING ON BLOCKCHAIN...
                </>
              ) : (
                <>
                  <span className="text-xl mr-3">🌐</span>
                  REGISTER IDENTITY ON BLOCKDAG NETWORK
                </>
              )}
            </span>
          </button>
        </form>
      )}

      {/* Status Message */}
      {message && (
        <div className={`mt-6 p-4 rounded-2xl border ${
          message.includes('✅') 
            ? 'bg-green-500/10 border-green-500 text-green-300' 
            : message.includes('⏳')
            ? 'bg-blue-500/10 border-blue-500 text-blue-300'
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
          { icon: '🔐', label: 'Encrypted Identity', desc: 'AES-256 Protected' },
          { icon: '✅', label: 'Multi-Sig Verified', desc: 'Government Certified' },
          { icon: '🌐', label: 'BlockDAG Secured', desc: 'Immutable Records' }
        ].map((feature, index) => (
          <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:scale-105 transition-all duration-300">
            <div className="text-blue-400 text-2xl mb-2">{feature.icon}</div>
            <p className="text-white text-sm font-semibold">{feature.label}</p>
            <p className="text-blue-300 text-xs">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IdentityRegister;