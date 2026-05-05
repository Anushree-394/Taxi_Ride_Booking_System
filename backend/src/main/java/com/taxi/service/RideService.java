package com.taxi.service;

import com.taxi.dto.RideRequestDto;
import com.taxi.model.Ride;
import com.taxi.model.RideStatus;
import com.taxi.repository.RideRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RideService {

    private final RideRepository rideRepository;

    public Ride requestRide(RideRequestDto dto) {
        Ride ride = new Ride();
        ride.setPickupLocation(dto.getPickupLocation());
        ride.setDropoffLocation(dto.getDropoffLocation());
        ride.setEstimatedFare(dto.getEstimatedFare());
        ride.setStatus(RideStatus.REQUESTED);
        return rideRepository.save(ride);
    }

    public Ride acceptRide(Long rideId, String driverName, String driverVehicle) {
        Optional<Ride> optionalRide = rideRepository.findById(rideId);
        if (optionalRide.isPresent()) {
            Ride ride = optionalRide.get();
            ride.setDriverName(driverName);
            ride.setDriverVehicle(driverVehicle);
            ride.setStatus(RideStatus.ACCEPTED);
            return rideRepository.save(ride);
        }
        throw new RuntimeException("Ride not found");
    }

    public Ride updateRideStatus(Long rideId, RideStatus status) {
        Optional<Ride> optionalRide = rideRepository.findById(rideId);
        if (optionalRide.isPresent()) {
            Ride ride = optionalRide.get();
            ride.setStatus(status);
            return rideRepository.save(ride);
        }
        throw new RuntimeException("Ride not found");
    }

    public Ride getRideStatus(Long rideId) {
        return rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));
    }

    public List<Ride> getAllRides() {
        return rideRepository.findAllByOrderByCreatedAtDesc();
    }
    
    public List<Ride> getRequestedRides() {
        return rideRepository.findByStatus(RideStatus.REQUESTED);
    }
}
