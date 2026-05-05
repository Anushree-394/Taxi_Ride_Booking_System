import React, { useState, useEffect } from 'react';
import { getAllRides } from '../api';
import { motion } from 'framer-motion';
import { Clock, MapPin, Navigation, DollarSign, CheckCircle } from 'lucide-react';

export default function RideHistory() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getAllRides();
        setRides(data.filter(r => r.status === 'COMPLETED'));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="max-w-md mx-auto pt-6 pb-20 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Ride History</h2>
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card rounded-3xl p-5 animate-pulse-slow">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mt-4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto pt-6 pb-20">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Ride History</h2>
      
      {rides.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No past rides found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rides.map((ride, i) => (
            <motion.div
              key={ride.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                  <Clock className="w-4 h-4" />
                  {new Date(ride.createdAt).toLocaleDateString()}
                </div>
                <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Completed
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-gray-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">{ride.pickupLocation}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center">
                    <Navigation className="w-4 h-4 text-primary-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">{ride.dropoffLocation}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 flex justify-between items-center mt-2">
                <div className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-900">{ride.driverName}</span> • {ride.driverVehicle}
                </div>
                <div className="text-lg font-bold text-gray-900">
                  ${ride.estimatedFare.toFixed(2)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
