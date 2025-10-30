// src/components/crisis/EmergencyDeclare.jsx
import React, { useState } from 'react';
import { useWeb3 } from '../../context/Web3Context';

const EmergencyDeclare = () => {
  const { contract, account, declareEmergency, balance, isIdentityVerified } = useWeb3();
  const [formData, setFormData] = useState({
    emergencyType: '0',
    location: '',
    encryptedData: '',
    dataHash: '',
    initialResponders: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [crisisId, setCrisisId] = useState('');
  const [verificationRequired, setVerificationRequired] = useState(false);

  const emergencyTypes = [
    { value: '0', label: '🌪️ Natural Disaster', color: 'text-orange-400', bg: 'from-orange-500 to-red-500' },
    { value: '1', label: '🏥 Medical Emergency', color: 'text-red-400', bg: 'from-red-500 to-pink-500' },
    { value: '2', label: '🛡️ Security Threat', color: 'text-yellow-400', bg: 'from-yellow-500 to-orange-500' },
    { value: '3', label: '🏗️ Infrastructure Failure', color: 'text-blue-400', bg: 'from-blue-500 to-cyan-500' },
    { value: '4', label: '🔥 Wildfire Emergency', color: 'text-orange-400', bg: 'from-orange-500 to-red-500' },
    { value: '5', label: '🌊 Flood Emergency', color: 'text-cyan-400', bg: 'from-cyan-500 to-blue-500' }
  ];

  const handleDeclareEmergency = async (e) => {
    e.preventDefault();
    
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
        setMessage('❌ Only verified identities can declare emergencies. Please register and verify your identity first.');
        return;
      }
    } catch (error) {
      setMessage('❌ Error checking identity verification');
      return;
    }

    setLoading(true);
    setMessage('');
    setTransactionHash('');
    setCrisisId('');
    setVerificationRequired(false);

    try {
      console.log('🚨 Starting emergency declaration on blockchain...');

      const responders = formData.initialResponders
        .split(',')
        .map(addr => addr.trim())
        .filter(addr => addr !== '' && ethers.isAddress(addr));

      // Validate location
      if (!formData.location.trim()) {
        throw new Error('Location is required');
      }

      setMessage('⏳ Sending emergency declaration to blockchain...');

      const result = await declareEmergency(
        parseInt(formData.emergencyType),
        formData.location,
        formData.encryptedData || "",
        formData.dataHash || "",
        responders
      );

      setTransactionHash(result.transactionHash);
      setCrisisId(result.crisisId);
      setVerificationRequired(true);
      
      setMessage(`✅ EMERGENCY DECLARED SUCCESSFULLY! Crisis ID: ${result.crisisId}. Transaction: ${result.transactionHash.substring(0, 10)}...`);
      
      // Reset form
      setFormData({
        emergencyType: '0',
        location: '',
        encryptedData: '',
        dataHash: '',
        initialResponders: ''
      });
      
    } catch (error) {
      console.error('Emergency declaration error:', error);
      let errorMessage = '❌ Error: ' + (error.reason || error.message);
      
      if (error.message.includes('user rejected transaction')) {
        errorMessage = '❌ Transaction rejected by user';
      } else if (error.message.includes('insufficient funds')) {
        errorMessage = '❌ Insufficient funds for transaction';
      } else if (error.message.includes('not verified')) {
        errorMessage = '❌ Only verified responders can declare emergencies';
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

  const getEmergencyColor = (type) => {
    const emergency = emergencyTypes.find(t => t.value === type);
    return emergency ? emergency.color : 'text-blue-300';
  };

  const getEmergencyBg = (type) => {
    const emergency = emergencyTypes.find(t => t.value === type);
    return emergency ? emergency.bg : 'from-blue-500 to-purple-500';
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-2xl shadow-red-500/30 animate-pulse">
          🚨
        </div>
        <h2 className="text-3xl font-black text-white mb-2">EMERGENCY DECLARATION</h2>
        <p className="text-red-200">Report critical emergency situations on the global BlockDAG network</p>
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
            <p className="text-blue-300 text-sm font-semibold mb-2">🆔 IDENTITY STATUS</p>
            <p className="text-green-400 font-semibold text-lg bg-green-500/10 rounded-lg p-3 text-center">
              VERIFIED REQUIRED ✅
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Alert Banner */}
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-8 animate-pulse">
        <div className="flex items-center justify-center space-x-4">
          <div className="w-4 h-4 bg-red-400 rounded-full animate-ping"></div>
          <p className="text-red-300 font-semibold text-lg text-center">
            ⚠️ CRITICAL ACTION: This declaration will trigger global emergency protocols and require blockchain transaction
          </p>
        </div>
      </div>

      <form onSubmit={handleDeclareEmergency} className="space-y-6">
        {/* Emergency Type */}
        <div>
          <label className="block text-red-300 text-sm font-semibold mb-3">
            🚨 EMERGENCY TYPE
          </label>
          <select
            name="emergencyType"
            value={formData.emergencyType}
            onChange={handleChange}
            className={`w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 ${getEmergencyColor(formData.emergencyType)} focus:outline-none focus:border-red-500 focus:bg-white/10 transition-all duration-300`}
            required
          >
            {emergencyTypes.map(type => (
              <option key={type.value} value={type.value} className={type.color}>
                {type.label}
              </option>
            ))}
          </select>
          <p className="text-red-300 text-xs mt-2">Select emergency category for proper resource allocation and response coordination</p>
        </div>

        {/* Location */}
        <div>
          <label className="block text-red-300 text-sm font-semibold mb-3">
            📍 EMERGENCY LOCATION
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="GPS coordinates, exact address, or area description"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-red-300 focus:outline-none focus:border-red-500 focus:bg-white/10 transition-all duration-300"
            required
          />
          <p className="text-red-300 text-xs mt-2">Provide precise location information for emergency responder dispatch</p>
        </div>

        {/* Encrypted Data */}
        <div>
          <label className="block text-red-300 text-sm font-semibold mb-3">
            🔒 ENCRYPTED EMERGENCY DATA
          </label>
          <textarea
            name="encryptedData"
            value={formData.encryptedData}
            onChange={handleChange}
            placeholder="AES-256 encrypted emergency details, victim information, or sensitive situational data..."
            rows="4"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-red-300 focus:outline-none focus:border-red-500 focus:bg-white/10 transition-all duration-300 font-mono text-sm"
          />
          <p className="text-red-300 text-xs mt-2">Military-grade encrypted data accessible only to authorized emergency responders</p>
        </div>

        {/* Data Hash */}
        <div>
          <label className="block text-red-300 text-sm font-semibold mb-3">
            🔑 DATA INTEGRITY HASH
          </label>
          <input
            type="text"
            name="dataHash"
            value={formData.dataHash}
            onChange={handleChange}
            placeholder="SHA-256 hash of emergency data for cryptographic verification"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-red-300 focus:outline-none focus:border-red-500 focus:bg-white/10 transition-all duration-300 font-mono text-sm"
          />
          <p className="text-red-300 text-xs mt-2">Cryptographic hash to ensure data integrity and prevent tampering</p>
        </div>

        {/* Initial Responders */}
        <div>
          <label className="block text-red-300 text-sm font-semibold mb-3">
            👥 INITIAL RESPONDERS
          </label>
          <input
            type="text"
            name="initialResponders"
            value={formData.initialResponders}
            onChange={handleChange}
            placeholder="0x742d...1c3a, 0x8a9f...2b4c (comma-separated verified wallet addresses)"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-red-300 focus:outline-none focus:border-red-500 focus:bg-white/10 transition-all duration-300 font-mono text-sm"
          />
          <p className="text-red-300 text-xs mt-2">Pre-authorize specific emergency responders for immediate access to crisis data</p>
        </div>

        {/* Transaction Cost Warning */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4">
          <div className="flex items-center space-x-3">
            <span className="text-yellow-400 text-lg">💰</span>
            <div>
              <p className="text-yellow-300 font-semibold">Blockchain Transaction Required</p>
              <p className="text-yellow-200 text-sm">This emergency declaration will require a gas fee and create an immutable record on the BlockDAG network</p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !contract || !account}
          className={`w-full bg-gradient-to-r ${getEmergencyBg(formData.emergencyType)} hover:scale-105 text-white py-4 px-6 rounded-2xl font-black text-lg transition-all duration-300 transform disabled:opacity-50 disabled:transform-none group relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <span className="relative z-10 flex items-center justify-center">
            {loading ? (
              <>
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                DECLARING ON BLOCKCHAIN...
              </>
            ) : (
              <>
                <span className="text-xl mr-3">🚨</span>
                DECLARE EMERGENCY ON BLOCKDAG NETWORK
              </>
            )}
          </span>
        </button>
      </form>

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
          {crisisId && crisisId !== 'Unknown' && (
            <div className="mt-2 text-sm">
              <span className="opacity-80">Crisis ID: </span>
              <span className="font-mono font-bold">{crisisId}</span>
            </div>
          )}
        </div>
      )}

      {/* Multi-Signature Verification Notice */}
      {verificationRequired && (
        <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-start space-x-4">
            <div className="text-blue-400 text-2xl mt-1">✅</div>
            <div>
              <h4 className="font-semibold text-blue-400 mb-2">MULTI-SIGNATURE VERIFICATION REQUIRED</h4>
              <p className="text-blue-200 text-sm">
                This emergency declaration has been recorded on BlockDAG. It now requires verification from other authorized responders 
                before being fully activated in the global emergency network.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Protocol Info */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h4 className="font-semibold text-white mb-3 flex items-center">
            <span className="text-blue-400 mr-2">🔐</span>
            Encryption Protocol
          </h4>
          <ul className="text-blue-200 text-sm space-y-2">
            <li>• AES-256 end-to-end encryption</li>
            <li>• ECC for secure key exchange</li>
            <li>• Zero-knowledge proofs</li>
            <li>• Quantum-resistant algorithms</li>
          </ul>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h4 className="font-semibold text-white mb-3 flex items-center">
            <span className="text-green-400 mr-2">🌐</span>
            BlockDAG Network
          </h4>
          <ul className="text-blue-200 text-sm space-y-2">
            <li>• Instant global synchronization</li>
            <li>• Parallel transaction processing</li>
            <li>• Immutable audit trail</li>
            <li>• 99.99% uptime guarantee</li>
          </ul>
        </div>
      </div>

      {/* Security Warning */}
      <div className="mt-6 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6">
        <div className="flex items-start space-x-4">
          <div className="text-yellow-400 text-2xl mt-1">⚠️</div>
          <div>
            <h4 className="font-semibold text-yellow-400 mb-2">EMERGENCY PROTOCOL ACTIVATED</h4>
            <p className="text-yellow-200 text-sm">
              This declaration triggers global emergency protocols. All data is encrypted and accessible only to verified emergency responders. 
              False reports may result in account suspension and legal consequences. Use only for genuine emergencies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyDeclare;