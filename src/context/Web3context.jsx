import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { LIFELINE_DAG_ABI, CONTRACT_ADDRESS } from '../contracts/config';

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider');
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState(null);
  const [error, setError] = useState('');
  const [balance, setBalance] = useState('0');
  const [chainId, setChainId] = useState(null);
  const [networkName, setNetworkName] = useState('');
  const [transactionHistory, setTransactionHistory] = useState([]);

  // Network configuration
  const SUPPORTED_NETWORKS = {
    1: 'Ethereum Mainnet',
    5: 'Goerli Testnet', 
    11155111: 'Sepolia Testnet',
    31337: 'Hardhat Local'
  };

  useEffect(() => {
    checkIfWalletConnected();
    if (window.ethereum) {
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
  }, []);

  const checkIfWalletConnected = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_accounts' 
        });
        if (accounts.length > 0) {
          await setupWeb3(accounts[0]);
        }
        await checkNetwork();
      } catch (error) {
        console.error('Error checking wallet connection:', error);
        setError('Failed to check wallet connection');
      }
    } else {
      setError('MetaMask not detected. Please install MetaMask.');
    }
  };

  const handleChainChanged = (chainId) => {
    window.location.reload();
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else if (accounts[0] !== account) {
      setupWeb3(accounts[0]);
    }
  };

  const checkNetwork = async () => {
    if (window.ethereum) {
      try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        const chainIdNum = parseInt(chainId, 16);
        setChainId(chainIdNum);
        setNetworkName(SUPPORTED_NETWORKS[chainIdNum] || 'Unknown Network');
        return chainIdNum;
      } catch (error) {
        console.error('Error checking network:', error);
      }
    }
    return null;
  };

  const switchNetwork = async (targetChainId = 11155111) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
    } catch (error) {
      if (error.code === 4902) {
        await addNetwork(targetChainId);
      }
    }
  };

  const addNetwork = async (chainId) => {
    const networkParams = {
      11155111: {
        chainId: '0xaa36a7',
        chainName: 'Sepolia Testnet',
        rpcUrls: ['https://sepolia.infura.io/v3/'],
        nativeCurrency: {
          name: 'Sepolia ETH',
          symbol: 'ETH',
          decimals: 18
        },
        blockExplorerUrls: ['https://sepolia.etherscan.io']
      },
      5: {
        chainId: '0x5',
        chainName: 'Goerli Testnet',
        rpcUrls: ['https://goerli.infura.io/v3/'],
        nativeCurrency: {
          name: 'Goerli ETH',
          symbol: 'ETH', 
          decimals: 18
        },
        blockExplorerUrls: ['https://goerli.etherscan.io']
      }
    };
    
    if (networkParams[chainId]) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [networkParams[chainId]],
      });
    }
  };

  const setupWeb3 = async (address) => {
    try {
      setIsLoading(true);
      
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await web3Provider.getSigner();
      
      let signerAddress;
      try {
        signerAddress = await signer.getAddress();
      } catch (ensError) {
        signerAddress = address;
      }
      
      const lifelineContract = new ethers.Contract(
        CONTRACT_ADDRESS, 
        LIFELINE_DAG_ABI, 
        signer
      );

      // Get balance
      const balanceWei = await web3Provider.getBalance(signerAddress);
      const balanceEth = ethers.formatEther(balanceWei);

      setProvider(web3Provider);
      setContract(lifelineContract);
      setAccount(signerAddress);
      setBalance(balanceEth);
      setIsConnected(true);
      setError('');
      
      await checkNetwork();
      
    } catch (error) {
      console.error('❌ Setup error:', error);
      setError(`Failed to setup: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('Please install MetaMask to use LifelineDAG!');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts.length > 0) {
        await setupWeb3(accounts[0]);
      } else {
        setError('No accounts found in MetaMask');
      }
      
    } catch (error) {
      console.error('❌ Error connecting wallet:', error);
      if (error.code === 4001) {
        setError('Connection rejected. Please approve the connection in MetaMask.');
      } else {
        setError(`Failed to connect: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setContract(null);
    setProvider(null);
    setIsConnected(false);
    setBalance('0');
    setChainId(null);
    setNetworkName('');
    setError('Wallet disconnected');
  };

  const addTransactionToHistory = (tx) => {
    setTransactionHistory(prev => [{
      hash: tx.hash,
      type: tx.type || 'unknown',
      status: 'pending',
      timestamp: Date.now(),
      ...tx
    }, ...prev]);
  };

  const updateTransactionStatus = (hash, status, receipt = null) => {
    setTransactionHistory(prev => 
      prev.map(tx => 
        tx.hash === hash 
          ? { ...tx, status, receipt, confirmedAt: Date.now() }
          : tx
      )
    );
  };

  const handleTransactionError = (error) => {
    let userMessage = 'Transaction failed';
    
    if (error.code === 'ACTION_REJECTED') {
      userMessage = 'Transaction rejected by user';
    } else if (error.code === 'INSUFFICIENT_FUNDS') {
      userMessage = 'Insufficient funds for transaction';
    } else if (error.message.includes('gas')) {
      userMessage = 'Gas estimation failed. Please try again.';
    } else if (error.message.includes('network')) {
      userMessage = 'Network error. Please check your connection.';
    } else if (error.message.includes('revert')) {
      userMessage = 'Transaction reverted. Check contract requirements.';
    }
    
    setError(userMessage);
    return userMessage;
  };

  // Contract Functions
  const registerIdentity = async (did, sector, metadataURI = "") => {
    if (!contract) throw new Error('Contract not connected');
    
    try {
      const tx = await contract.registerIdentity(did, sector, metadataURI);
      addTransactionToHistory({ hash: tx.hash, type: 'registerIdentity' });
      const receipt = await tx.wait();
      updateTransactionStatus(tx.hash, 'confirmed', receipt);
      return receipt;
    } catch (error) {
      handleTransactionError(error);
      throw error;
    }
  };

  const declareEmergency = async (emergencyType, location, encryptedData = "", dataHash = "", initialResponders = []) => {
    if (!contract) throw new Error('Contract not connected');
    
    try {
      const tx = await contract.declareEmergency(
        emergencyType,
        location,
        encryptedData,
        dataHash,
        initialResponders
      );
      addTransactionToHistory({ hash: tx.hash, type: 'declareEmergency' });
      const receipt = await tx.wait();
      updateTransactionStatus(tx.hash, 'confirmed', receipt);
      
      // Extract crisisId from event logs
      let crisisId = 'Unknown';
      if (receipt.logs && receipt.logs.length > 0) {
        try {
          const event = contract.interface.parseLog(receipt.logs[0]);
          if (event && event.args && event.args.crisisId) {
            crisisId = event.args.crisisId.toString();
          }
        } catch (parseError) {
          console.log('Could not parse crisisId from logs');
        }
      }
      
      return { ...receipt, crisisId };
    } catch (error) {
      handleTransactionError(error);
      throw error;
    }
  };

  const emergencyAccess = async (crisisId) => {
    if (!contract) throw new Error('Contract not connected');
    try {
      const tx = await contract.emergencyAccess(crisisId);
      addTransactionToHistory({ hash: tx.hash, type: 'emergencyAccess' });
      const receipt = await tx.wait();
      updateTransactionStatus(tx.hash, 'confirmed', receipt);
      return receipt;
    } catch (error) {
      handleTransactionError(error);
      throw error;
    }
  };

  const verifyIdentity = async (wallet, verified) => {
    if (!contract) throw new Error('Contract not connected');
    try {
      const tx = await contract.verifyIdentity(wallet, verified);
      addTransactionToHistory({ hash: tx.hash, type: 'verifyIdentity' });
      const receipt = await tx.wait();
      updateTransactionStatus(tx.hash, 'confirmed', receipt);
      return receipt;
    } catch (error) {
      handleTransactionError(error);
      throw error;
    }
  };

  const verifyCrisis = async (crisisId, signatures = []) => {
    if (!contract) throw new Error('Contract not connected');
    try {
      const tx = await contract.verifyCrisis(crisisId, signatures);
      addTransactionToHistory({ hash: tx.hash, type: 'verifyCrisis' });
      const receipt = await tx.wait();
      updateTransactionStatus(tx.hash, 'confirmed', receipt);
      return receipt;
    } catch (error) {
      handleTransactionError(error);
      throw error;
    }
  };

  const getAllCrises = async () => {
    if (!contract) throw new Error('Contract not connected');
    try {
      const crisisCount = await contract.crisisCount();
      const crises = [];
      
      for (let i = 0; i < crisisCount; i++) {
        const crisis = await contract.crises(i);
        crises.push({
          crisisId: crisis.crisisId,
          emergencyType: crisis.emergencyType,
          location: crisis.location,
          encryptedData: crisis.encryptedData,
          dataHash: crisis.dataHash,
          declaredBy: crisis.declaredBy,
          timestamp: crisis.timestamp,
          verified: crisis.verified,
          verificationCount: crisis.verificationCount
        });
      }
      return crises;
    } catch (error) {
      console.error('Error getting crises:', error);
      throw error;
    }
  };

  const getCrisis = async (crisisId) => {
    if (!contract) throw new Error('Contract not connected');
    try {
      return await contract.crises(crisisId);
    } catch (error) {
      console.error('Error getting crisis:', error);
      throw error;
    }
  };

  const getCrisisCount = async () => {
    if (!contract) throw new Error('Contract not connected');
    try {
      return await contract.crisisCount();
    } catch (error) {
      console.error('Error getting crisis count:', error);
      throw error;
    }
  };

  const getIdentity = async (walletAddress) => {
    if (!contract) throw new Error('Contract not connected');
    try {
      return await contract.identities(walletAddress);
    } catch (error) {
      console.error('Error getting identity:', error);
      throw error;
    }
  };

  const isIdentityVerified = async (walletAddress) => {
    if (!contract) throw new Error('Contract not connected');
    try {
      return await contract.isVerified(walletAddress);
    } catch (error) {
      console.error('Error checking identity verification:', error);
      throw error;
    }
  };

  const grantCrisisAccess = async (crisisId, userAddress, duration) => {
    if (!contract) throw new Error('Contract not connected');
    try {
      // Note: You'll need to implement grantAccess in your contract
      // Using emergencyAccess as fallback for now
      const tx = await contract.emergencyAccess(crisisId);
      addTransactionToHistory({ hash: tx.hash, type: 'grantCrisisAccess' });
      const receipt = await tx.wait();
      updateTransactionStatus(tx.hash, 'confirmed', receipt);
      return receipt;
    } catch (error) {
      handleTransactionError(error);
      throw error;
    }
  };

  const canAccessCrisis = async (crisisId, userAddress) => {
    if (!contract) throw new Error('Contract not connected');
    try {
      return await contract.canAccessCrisis(crisisId, userAddress);
    } catch (error) {
      console.error('Error checking access:', error);
      throw error;
    }
  };

  const getCrisisAccessLogs = async (crisisId) => {
    if (!contract) throw new Error('Contract not connected');
    try {
      // This would need to be implemented based on your contract events
      // For now, return mock data that matches the expected format
      return [
        { 
          user: account || '0x742d...1c3a', 
          crisis: 'Southeast Asia Floods', 
          grantedAt: '2 hours ago', 
          expiresIn: '22 hours', 
          status: 'active',
          transactionHash: '0xabc123...def456'
        },
        { 
          user: '0x8a9f...2b4c', 
          crisis: 'Metro Hospital Emergency', 
          grantedAt: '1 hour ago', 
          expiresIn: '23 hours', 
          status: 'active',
          transactionHash: '0xdef456...abc123'
        }
      ];
    } catch (error) {
      console.error('Error getting access logs:', error);
      throw error;
    }
  };

  const value = {
    // State
    account,
    contract,
    provider,
    isConnected,
    isLoading,
    error,
    balance,
    chainId,
    networkName,
    transactionHistory,

    // Connection
    connectWallet,
    disconnectWallet,
    switchNetwork,

    // Contract Functions
    registerIdentity,
    declareEmergency,
    emergencyAccess,
    verifyIdentity,
    verifyCrisis,
    getAllCrises,
    getCrisis,
    getCrisisCount,
    getIdentity,
    isIdentityVerified,
    grantCrisisAccess,
    canAccessCrisis,
    getCrisisAccessLogs,

    // Utilities
    handleTransactionError
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};