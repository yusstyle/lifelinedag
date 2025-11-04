// src/App.jsx - SIMPLE & WORKING
import React from 'react'
import { Web3Provider } from './context/Web3Context'
import Dashboard from './components/crisis/Dashboard'

function App() {
  return (
    <Web3Provider>
      <Dashboard />
    </Web3Provider>
  )
}

export default App