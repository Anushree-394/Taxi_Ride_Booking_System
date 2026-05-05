package com.taxi.controller;

import com.taxi.dto.RideRequestDto;
import com.taxi.model.Ride;
import com.taxi.model.RideStatus;
import com.taxi.service.RideService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rides")
@RequiredArgsConstructor
public class RideController {

    private final RideService rideService;

    @PostMapping("/request")
    public ResponseEntity<Ride> requestRide(@RequestBody RideRequestDto dto) {
        return ResponseEntity.ok(rideService.requestRide(dto));
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<Ride> acceptRide(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String driverName = payload.getOrDefault("driverName", "John Doe");
        String driverVehicle = payload.getOrDefault("driverVehicle", "Toyota Prius - XYZ 1234");
        return ResponseEntity.ok(rideService.acceptRide(id, driverName, driverVehicle));
    }

    @PostMapping("/{id}/start")
    public ResponseEntity<Ride> startRide(@PathVariable Long id) {
        return ResponseEntity.ok(rideService.updateRideStatus(id, RideStatus.STARTED));
    }

    @PostMapping("/{id}/end")
    public ResponseEntity<Ride> endRide(@PathVariable Long id) {
        return ResponseEntity.ok(rideService.updateRideStatus(id, RideStatus.COMPLETED));
    }

    @GetMapping("/{id}/status")
    public ResponseEntity<Ride> getRideStatus(@PathVariable Long id) {
        return ResponseEntity.ok(rideService.getRideStatus(id));
    }

    @GetMapping
    public ResponseEntity<List<Ride>> getAllRides() {
        return ResponseEntity.ok(rideService.getAllRides());
    }

    @GetMapping("/requested")
    public ResponseEntity<List<Ride>> getRequestedRides() {
        return ResponseEntity.ok(rideService.getRequestedRides());
    }
}
