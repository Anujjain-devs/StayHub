package com.stayhub.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.stayhub.dto.AmenityRequestDto;
import com.stayhub.dto.AmenityResponseDto;
import com.stayhub.service.AmenityService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/amenities")
@RequiredArgsConstructor
public class AmenityController {

	private final AmenityService amenityService;

	@PostMapping
	public ResponseEntity<AmenityResponseDto> createAmenity(
			@org.springframework.web.bind.annotation.RequestBody AmenityRequestDto dto) {

		return new ResponseEntity<>(amenityService.createAmenity(dto), HttpStatus.CREATED);
	}

	@GetMapping
	public ResponseEntity<List<AmenityResponseDto>> getAllAmenities() {

		return ResponseEntity.ok(amenityService.getAllAmenities());
	}

	@GetMapping("/{id}")
	public ResponseEntity<AmenityResponseDto> getAmenityById(@PathVariable Long id) {

		return ResponseEntity.ok(amenityService.getAmenityById(id));
	}

	@PutMapping("/{id}")
	public ResponseEntity<AmenityResponseDto> updateAmenity(@PathVariable Long id,
			@org.springframework.web.bind.annotation.RequestBody AmenityRequestDto dto) {

		return ResponseEntity.ok(amenityService.updateAmenity(id, dto));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteAmenity(@PathVariable Long id) {

		amenityService.deleteAmenity(id);

		return ResponseEntity.ok("Amenity deleted successfully");
	}

	@GetMapping("/pg/{pgListingId}")
	public ResponseEntity<List<AmenityResponseDto>> getAmenitiesByPg(@PathVariable Long pgListingId) {

		return ResponseEntity.ok(amenityService.getAmenitiesByPg(pgListingId));
	}
}
