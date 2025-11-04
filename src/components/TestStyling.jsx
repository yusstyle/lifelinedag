import React from 'react'

const TestStyling = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 to-blue-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">TAILWIND TEST</h1>
        <div className="space-y-4">
          <div className="bg-green-500 text-white p-4 rounded">Green Box</div>
          <div className="bg-purple-500 text-white p-4 rounded">Purple Box</div>
          <button className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-bold hover:bg-yellow-600">
            Yellow Button
          </button>
        </div>
      </div>
    </div>
  )
}

export default TestStyling
