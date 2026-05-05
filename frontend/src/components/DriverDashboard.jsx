import React, { useState, useEffect } from 'react';
import { getRequestedRides, acceptRide, startRide, endRide, getRideStatus } from '../api';
import { MapPin, Navigation, DollarSign, Clock, CheckCircle, Power } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function DriverDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const [requests, setRequests] = useState([]);
  const [activeRide, setActiveRide] = useState(null);

  const driverData = {
    driverName: "Alex Mercer",
    driverVehicle: "Tesla Model 3 - EV 9901"
  };

  // Poll for new requests if online and not on a ride
  useEffect(() => {
    let interval;
    if (isOnline && !activeRide) {
      const fetchRequests = async () => {
        try {
          const reqs = await getRequestedRides();
          setRequests(reqs);
          
          // Auto-accept simulation if requested in prompt
          if (reqs.length > 0) {
              const firstReq = reqs[0];
              const timeDiff = new Date() - new Date(firstReq.createdAt);
              // if wait time > 10s auto accept
              if (timeDiff > 10000) {
                  toast("Auto-accepting overdue request...");
                  handleAccept(firstReq.id);
              }
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchRequests();
      interval = setInterval(fetchRequests, 3000);
    } else {
      setRequests([]);
    }
    return () => clearInterval(interval);
  }, [isOnline, activeRide]);

  // Poll active ride status to sync
  useEffect(() => {
    let interval;
    if (activeRide && activeRide.status !== 'COMPLETED') {
        interval = setInterval(async () => {
            try {
                const ride = await getRideStatus(activeRide.id);
                setActiveRide(ride);
            } catch(e) {}
        }, 3000);
    }
    return () => clearInterval(interval);
  }, [activeRide]);

  const handleAccept = async (id) => {
    try {
      const ride = await acceptRide(id, driverData);
      setActiveRide(ride);
      toast.success("Ride accepted!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleStart = async () => {
    try {
      const ride = await startRide(activeRide.id);
      setActiveRide(ride);
      toast.success("Trip started!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleComplete = async () => {
    try {
      const ride = await endRide(activeRide.id);
      setActiveRide(ride);
      toast.success("Trip completed!");
      setTimeout(() => {
          setActiveRide(null); // Reset after 2 seconds
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto pt-6 pb-20">
      <div className="flex justify-between items-center mb-8 px-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Driver Mode</h2>
          <p className="text-sm text-gray-500">{isOnline ? 'Searching for trips...' : 'You are currently offline'}</p>
        </div>
        <button
          onClick={() => setIsOnline(!isOnline)}
          disabled={activeRide !== null}
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${
            isOnline ? 'bg-primary-500' : 'bg-gray-300'
          } ${activeRide ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
              isOnline ? 'translate-x-7' : 'translate-x-1'
            } shadow-md`}
          />
        </button>
      </div>

      {!isOnline && !activeRide && (
        <div className="glass-card rounded-3xl p-8 text-center mt-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Power className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Go online to earn</h3>
          <p className="text-gray-500">You're offline. Tap the switch above to start receiving ride requests.</p>
        </div>
      )}

      {isOnline && !activeRide && (
        <div className="space-y-4">
          {requests.length === 0 ? (
             <div className="text-center py-12">
               <div className="relative w-24 h-24 mx-auto mb-6">
                 <div className="absolute inset-0 bg-primary-100 rounded-full animate-ping opacity-50"></div>
                 <div className="absolute inset-4 bg-primary-200 rounded-full animate-ping delay-75 opacity-50"></div>
                 <div className="absolute inset-8 bg-primary-500 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/40">
                   <Navigation className="w-6 h-6 text-white" />
                 </div>
               </div>
               <p className="text-gray-500 font-medium">Finding riders near you...</p>
             </div>
          ) : (
            <AnimatePresence>
              {requests.map((req) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-primary-50 px-3 py-1 rounded-full text-primary-700 text-sm font-semibold flex items-center gap-1">
                      <Clock className="w-4 h-4" /> Just now
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500">Est. Fare</span>
                      <div className="text-xl font-bold text-gray-900">${req.estimatedFare.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6 relative pl-2">
                    <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-200"></div>
                    <div className="relative z-10 flex items-start gap-4">
                      <div className="w-4 h-4 rounded-full bg-gray-900 border-[3px] border-white shadow-sm mt-1 shrink-0"></div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-0.5">Pickup</p>
                        <p className="font-medium text-gray-900">{req.pickupLocation}</p>
                      </div>
                    </div>
                    <div className="relative z-10 flex items-start gap-4">
                      <div className="w-4 h-4 rounded-full bg-primary-500 border-[3px] border-white shadow-sm mt-1 shrink-0"></div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-0.5">Dropoff</p>
                        <p className="font-medium text-gray-900">{req.dropoffLocation}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAccept(req.id)}
                    className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-bold py-4 rounded-xl shadow-lg transform transition active:scale-95"
                  >
                    Accept Trip
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      )}

      {activeRide && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-2xl border border-gray-100"
        >
          <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Current Status</p>
              <h3 className="text-xl font-bold text-gray-900">
                {activeRide.status === 'ACCEPTED' ? 'Pick up rider' : activeRide.status === 'STARTED' ? 'Drop off rider' : 'Trip Completed'}
              </h3>
            </div>
            <div className="bg-primary-50 px-4 py-2 rounded-xl border border-primary-100">
              <span className="text-sm text-gray-500 block text-right">Fare</span>
              <span className="text-xl font-bold text-primary-700">${activeRide.estimatedFare.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-4 mb-8 relative">
            <div className={`relative flex items-center gap-4 p-4 rounded-2xl ${activeRide.status === 'ACCEPTED' ? 'bg-blue-50 border border-blue-100' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Pickup</p>
                <p className="font-semibold text-gray-900">{activeRide.pickupLocation}</p>
              </div>
            </div>
            
            <div className={`relative flex items-center gap-4 p-4 rounded-2xl ${activeRide.status === 'STARTED' ? 'bg-primary-50 border border-primary-100' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                <Navigation className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Dropoff</p>
                <p className="font-semibold text-gray-900">{activeRide.dropoffLocation}</p>
              </div>
            </div>
          </div>

          {activeRide.status === 'ACCEPTED' && (
            <button
              onClick={handleStart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex justify-center items-center gap-2"
            >
              Start Trip
            </button>
          )}

          {activeRide.status === 'STARTED' && (
            <button
              onClick={handleComplete}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-600/30 transition-all flex justify-center items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" /> Complete Trip
            </button>
          )}
          
          {activeRide.status === 'COMPLETED' && (
             <div className="text-center py-4 text-green-600 font-bold flex items-center justify-center gap-2">
                 <CheckCircle className="w-6 h-6" /> Ride Completed Successfully
             </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
