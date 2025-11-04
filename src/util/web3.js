// src/context/Web3Context.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { LIFELINE_DAG_ABI, CONTRACT_ADDRESS, BLOCKDAG_TESTNET_CONFIG } from '../contracts/config';

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider');
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState("0x742d35Cc6634C0532925a3b8Dc9B8eC7f2E5BdF1");
  const [contract, setContract] = useState({});
  const [isConnected, setIsConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [balance, setBalance] = useState('2.45');
  const [isBlockDAGNetwork, setIsBlockDAGNetwork] = useState(true);

  // Mock functions that work with your UI
  const registerIdentity = async (did, sector, metadataURI = "") => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Identity Registered:', { did, sector, metadataURI });
        resolve({ 
          transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
          status: 1
        });
      }, 2000);
    });
  };

  const declareEmergency = async (emergencyType, location, encryptedData = "", dataHash = "", initialResponders = []) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Emergency Declared:', { emergencyType, location, encryptedData, dataHash, initialResponders });
        resolve({ 
          transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
          crisisId: Math.floor(Math.random() * 1000).toString(),
          status: 1
        });
      }, 2500);
    });
  };

  const emergencyAccess = async (crisisId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Emergency Access Activated for crisis:', crisisId);
        resolve({ 
          transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
          status: 1
        });
      }, 1500);
    });
  };

  const verifyCrisis = async (crisisId, signatures = []) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Crisis Verified:', crisisId);
        resolve({ 
          transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
          status: 1
        });
      }, 1800);
    });
  };

  const grantCrisisAccess = async (crisisId, userAddress, duration) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Access Granted:', { crisisId, userAddress, duration });
        resolve({ 
          transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
          status: 1
        });
      }, 2000);
    });
  };

  const canAccessCrisis = async (crisisId, userAddress) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Math.random() > 0.5); // Random access for demo
      }, 500);
    });
  };

  const getAllCrises = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { 
            id: 1, 
            crisisId: '1',
            type: '🌪️ Natural Disaster',
            emergencyType: '0',
            location: 'Southeast Asia - Coastal Regions', 
            status: 'active', 
            verified: true,
            severity: 'high',
            responders: 45,
            progress: 65,
            lastUpdate: '2 minutes ago',
            declaredBy: '0x742d35Cc6634C0532925a3b8Dc9B8eC7f2E5BdF1',
            timestamp: '2024-01-15',
            verificationCount: '3'
          },
          { 
            id: 2, 
            crisisId: '2',
            type: '🏥 Medical Emergency',
            emergencyType: '1', 
            location: 'Central Hospital - Metro Area', 
            status: 'active', 
            verified: true,
            severity: 'critical',
            responders: 28,
            progress: 40,
            lastUpdate: '5 minutes ago',
            declaredBy: '0x8a9f2b4c7d3e1f6a5b4c8d9e0f1a2b3c4d5e6f7',
            timestamp: '2024-01-15',
            verificationCount: '2'
          },
          { 
            id: 3, 
            crisisId: '3',
            type: '🌊 Flood Emergency',
            emergencyType: '5', 
            location: 'Northern River Basin', 
            status: 'active', 
            verified: false,
            severity: 'high',
            responders: 32,
            progress: 25,
            lastUpdate: '10 minutes ago',
            declaredBy: '0x1234567890123456789012345678901234567890',
            timestamp: '2024-01-15',
            verificationCount: '1'
          }
        ]);
      }, 1000);
    });
  };

  const getCrisis = async (crisisId) => {
    const crises = await getAllCrises();
    return crises.find(c => c.crisisId === crisisId) || crises[0];
  };

  const getCrisisCount = async () => {
    const crises = await getAllCrises();
    return crises.length;
  };

  const getIdentity = async (walletAddress) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          wallet: walletAddress,
          did: 'did:ethr:' + walletAddress,
          sector: 0,
          metadataURI: 'https://ipfs.io/ipfs/QmExample123',
          verified: true,
          registrationDate: Math.floor(Date.now() / 1000) - 86400,
          lastVerified: Math.floor(Date.now() / 1000)
        });
      }, 500);
    });
  };

  const isIdentityVerified = async (walletAddress) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true); // Always verified for demo
      }, 300);
    });
  };

  const getCrisisAccessLogs = async (crisisId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { 
            user: '0x742d35Cc6634C0532925a3b8Dc9B8eC7f2E5BdF1', 
            crisis: 'Southeast Asia Floods', 
            grantedAt: '2 hours ago', 
            expiresIn: '22 hours', 
            status: 'active',
            transactionHash: '0xabc123def456abc123def456abc123def456abc123def456abc123def456abcd'
          },
          { 
            user: '0x8a9f2b4c7d3e1f6a5b4c8d9e0f1a2b3c4d5e6f7', 
            crisis: 'Metro Hospital Emergency', 
            grantedAt: '1 hour ago', 
            expiresIn: '23 hours', 
            status: 'active',
            transactionHash: '0xdef456abc123def456abc123def456abc123def456abc123def456abc123defa'
          },
          { 
            user: '0x1234567890123456789012345678901234567890', 
            crisis: 'Northern River Flood', 
            grantedAt: '30 minutes ago', 
            expiresIn: '23.5 hours', 
            status: 'active',
            transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
          }
        ]);
      }, 1000);
    });
  };

  const connectWallet = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsConnected(true);
      setIsLoading(false);
      setError('');
    }, 1500);
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAccount(null);
    setBalance('0');
  };

  const switchToBlockDAGTestnet = async () => {
    return true; // Mock success
  };

  const checkBlockDAGNetwork = async () => {
    return true; // Mock BlockDAG network
  };

  const value = {
    // State
    account,
    contract,
    isConnected,
    isLoading,
    error,
    balance,
    isBlockDAGNetwork,

    // Connection
    connectWallet,
    disconnectWallet,
    switchToBlockDAGTestnet,
    checkBlockDAGNetwork,

    // Contract Functions
    registerIdentity,
    declareEmergency,
    emergencyAccess,
    verifyCrisis,
    getAllCrises,
    getCrisis,
    getCrisisCount,
    getIdentity,
    isIdentityVerified,
    grantCrisisAccess,
    canAccessCrisis,
    getCrisisAccessLogs,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};