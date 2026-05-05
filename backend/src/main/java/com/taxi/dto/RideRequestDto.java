package com.taxi.dto;

import lombok.Data;

@Data
public class RideRequestDto {
    private String pickupLocation;
    private String dropoffLocation;
    private Double estimatedFare;
}
