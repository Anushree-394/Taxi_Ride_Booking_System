import React, { useState, useEffect } from 'react';
import { requestRide, getRideStatus } from '../api';
import { MapPin, Navigation, Car, Star, CreditCard, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function RiderDashboard() {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [currentRide, setCurrentRide] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);

  const calculateFare = () => {
    return Math.floor(Math.random() * 20) + 10; // Random fare between $10 and $30
  };

  const handleRequestRide = async () => {
    if (!pickup || !dropoff) return;
    setLoading(true);
    try {
      const fare = calculateFare();
      const ride = await requestRide({ pickupLocation: pickup, dropoffLocation: dropoff, estimatedFare: fare });
      setCurrentRide(ride);
      toast.success("Ride requested successfully!");
    } catch (error) {
      console.error("Failed to request ride", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval;
    if (currentRide && currentRide.status !== 'COMPLETED') {
      interval = setInterval(async () => {
        try {
          const updatedRide = await getRideStatus(currentRide.id);
          
          if (updatedRide.status !== currentRide.status) {
             if (updatedRide.status === 'ACCEPTED') toast.success(`Driver ${updatedRide.driverName} is arriving!`);
             if (updatedRide.status === 'STARTED') toast.success("Trip started. Have a safe ride!");
             if (updatedRide.status === 'COMPLETED') toast.success("You have arrived at your destination!");
          }
          
          setCurrentRide(updatedRide);
        } catch (error) {
          console.error("Failed to fetch status", error);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [currentRide]);

  return (
    <div className="max-w-md mx-auto relative pt-6 pb-20">
      <AnimatePresence mode="wait">
        {!currentRide ? (
          <motion.div
            key="request"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="glass-card rounded-3xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-primary-600"></div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Where to?</h2>
            
            <div className="space-y-4 mb-8 relative">
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200"></div>
              
              <div className="relative z-10 flex items-center">
                <div className="w-12 flex justify-center">
                  <div className="w-4 h-4 rounded-full bg-gray-900 border-4 border-white shadow-sm z-10"></div>
                </div>
                <input
                  type="text"
                  placeholder="Pickup Location"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                />
              </div>

              <div className="relative z-10 flex items-center">
                <div className="w-12 flex justify-center">
                  <div className="w-4 h-4 bg-primary-600 border-4 border-white shadow-sm z-10"></div>
                </div>
                <input
                  type="text"
                  placeholder="Dropoff Location"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                />
              </div>
            </div>

            {pickup && dropoff && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 bg-primary-50 rounded-xl border border-primary-100 flex justify-between items-center">
                <span className="text-primary-900 font-medium">Estimated Fare</span>
                <span className="text-2xl font-bold text-primary-700">${calculateFare().toFixed(2)}</span>
              </motion.div>
            )}

            <button
              onClick={handleRequestRide}
              disabled={!pickup || !dropoff || loading}
              className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white font-semibold py-4 rounded-xl transition-all shadow-lg flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Request Ride'}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="status"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Status Card */}
            <div className="glass-card rounded-3xl p-6 text-center shadow-2xl">
              {currentRide.status === 'REQUESTED' && (
                <div className="py-8">
                  <div className="w-20 h-20 mx-auto bg-primary-100 rounded-full flex items-center justify-center mb-6 relative">
                    <div className="absolute inset-0 border-4 border-primary-500 rounded-full animate-ping opacity-20"></div>
                    <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Finding your driver...</h3>
                  <p className="text-gray-500">Matching you with a nearby driver</p>
                </div>
              )}

              {(currentRide.status === 'ACCEPTED' || currentRide.status === 'STARTED') && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800">
                      {currentRide.status === 'ACCEPTED' ? 'Driver is arriving' : 'On Trip'}
                    </h3>
                    <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {currentRide.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl mb-6 border border-gray-100">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentRide.driverName}`} alt="Driver" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-bold text-gray-900 text-lg">{currentRide.driverName}</p>
                      <div className="flex items-center gap-1 text-sm text-yellow-500 mb-1">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-medium text-gray-700">4.9</span>
                      </div>
                      <p className="text-sm text-gray-500">{currentRide.driverVehicle}</p>
                    </div>
                  </div>

                  {/* Progress Line */}
                  <div className="relative pt-2 pb-6">
                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-primary-500 transition-all duration-1000 ${currentRide.status === 'STARTED' ? 'w-2/3' : 'w-1/3'}`}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                      <span>{currentRide.pickupLocation}</span>
                      <span>{currentRide.dropoffLocation}</span>
                    </div>
                  </div>
                </div>
              )}

              {currentRide.status === 'COMPLETED' && (
                <div className="py-6">
                  <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">You've arrived!</h3>
                  <p className="text-gray-500 mb-8">Hope you enjoyed your ride.</p>
                  
                  <div className="bg-gray-50 rounded-2xl p-4 mb-8">
                    <div className="flex justify-between items-center text-lg mb-2">
                      <span className="text-gray-600">Total Fare</span>
                      <span className="font-bold text-gray-900">${currentRide.estimatedFare.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 border-t pt-2 mt-2">
                      <CreditCard className="w-4 h-4" /> Paid with Visa ending in •••• 4242
                    </div>
                  </div>

                  <div className="mb-8">
                    <p className="font-medium text-gray-700 mb-4">Rate your driver</p>
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} onClick={() => setRating(star)} className="focus:outline-none transition-transform hover:scale-110">
                          <Star className={`w-8 h-8 ${rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCurrentRide(null);
                      setPickup('');
                      setDropoff('');
                      setRating(0);
                    }}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 rounded-xl transition-all"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
