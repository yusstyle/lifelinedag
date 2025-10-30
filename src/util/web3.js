import React, { createContext, useContext, useState, useEffect } from 'react';

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

  const connectWallet = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsConnected(true);
      setIsLoading(false);
    }, 1000);
  };

  // Mock functions for development
  const registerIdentity = async (did, sector, metadataURI = "") => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ transactionHash: '0xmock123' }), 2000);
    });
  };

  const declareEmergency = async (emergencyType, location, encryptedData = "", dataHash = "", initialResponders = []) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ 
        logs: [{ args: { crisisId: '123' } }] 
      }), 2000);
    });
  };

  const emergencyAccess = async (crisisId) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({}), 1500);
    });
  };

  const verifyIdentity = async (wallet, verified) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({}), 1500);
    });
  };

  const value = {
    account,
    contract,
    isConnected,
    isLoading,
    connectWallet,
    error,
    registerIdentity,
    declareEmergency,
    emergencyAccess,
    verifyIdentity
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};