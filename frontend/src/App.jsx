import React, { useState } from 'react';
import RiderDashboard from './components/RiderDashboard';
import DriverDashboard from './components/DriverDashboard';
import RideHistory from './components/RideHistory';
import { Car, User, Clock } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

function App() {
  const [role, setRole] = useState('rider');

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-primary-100">
      <Toaster position="top-center" />
      {/* Premium Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-gray-900 to-gray-700 text-white p-2 rounded-xl shadow-sm">
              <Car className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              SwiftRide
            </h1>
          </div>
          
          {/* Role Toggle */}
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setRole('rider')}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                role === 'rider' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Rider
            </button>
            <button
              onClick={() => setRole('driver')}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                role === 'driver' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Driver
            </button>
            <button
              onClick={() => setRole('history')}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-1 ${
                role === 'history' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Clock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="px-4">
        {role === 'rider' && <RiderDashboard />}
        {role === 'driver' && <DriverDashboard />}
        {role === 'history' && <RideHistory />}
      </main>
    </div>
  );
}

export default App;
