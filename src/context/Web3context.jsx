// src/context/Web3Context.js - SIMPLE & WORKING
import React, { createContext, useContext, useState } from 'react';

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider');
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  const [account] = useState("0x742d35Cc6634C0532925a3b8Dc9B8eC7f2E5BdF1");
  const [balance] = useState('2.45');
  const [isConnected] = useState(true);

  // Simple mock functions
  const registerIdentity = async () => {
    return { transactionHash: '0x123...' };
  };

  const declareEmergency = async () => {
    return { 
      transactionHash: '0x456...',
      crisisId: '123'
    };
  };

  const emergencyAccess = async () => {
    return { transactionHash: '0x789...' };
  };

  const verifyCrisis = async () => {
    return { transactionHash: '0xabc...' };
  };

  const grantCrisisAccess = async () => {
    return { transactionHash: '0xdef...' };
  };

  const canAccessCrisis = async () => {
    return true;
  };

  const getAllCrises = async () => {
    return [
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
        declaredBy: '0x742d...1c3a'
      }
    ];
  };

  const getIdentity = async () => {
    return {
      wallet: '0x742d35Cc6634C0532925a3b8Dc9B8eC7f2E5BdF1',
      did: 'did:ethr:0x742d35Cc6634C0532925a3b8Dc9B8eC7f2E5BdF1',
      verified: true
    };
  };

  const isIdentityVerified = async () => {
    return true;
  };

  const getCrisisAccessLogs = async () => {
    return [
      { 
        user: '0x742d...1c3a', 
        crisis: 'Southeast Asia Floods', 
        grantedAt: '2 hours ago', 
        expiresIn: '22 hours', 
        status: 'active'
      }
    ];
  };

  const value = {
    account,
    balance,
    isConnected,
    registerIdentity,
    declareEmergency,
    emergencyAccess,
    verifyCrisis,
    grantCrisisAccess,
    canAccessCrisis,
    getAllCrises,
    getIdentity,
    isIdentityVerified,
    getCrisisAccessLogs,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};