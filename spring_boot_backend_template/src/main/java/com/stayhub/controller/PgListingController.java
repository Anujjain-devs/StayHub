package com.stayhub.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.stayhub.dto.PgListingRequestDto;
import com.stayhub.dto.PgListingResponseDto;
import com.stayhub.dto.RoomResponseDto;
import com.stayhub.enums.GenderPreference;
import com.stayhub.enums.SharingType;
import com.stayhub.service.PgListingService;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/pg-listings")
@RequiredArgsConstructor
public class PgListingController {

	private final PgListingService pgListingService;

	@PostMapping
	public ResponseEntity<PgListingResponseDto> createPg(@RequestBody PgListingRequestDto dto) {

		return new ResponseEntity<>(pgListingService.createPg(dto), HttpStatus.CREATED);
	}

	@GetMapping
	public ResponseEntity<List<PgListingResponseDto>> getAllPgListings() {

		return ResponseEntity.ok(pgListingService.getAllPgListings());
	}

	@GetMapping("/{id}")
	public ResponseEntity<PgListingResponseDto> getPgListingById(@PathVariable Long id) {

		return ResponseEntity.ok(pgListingService.getPgListingById(id));
	}

	@PutMapping("/{id}")
	public ResponseEntity<PgListingResponseDto> updatePg(@PathVariable Long id, @RequestBody PgListingRequestDto dto) {

		return ResponseEntity.ok(pgListingService.updatePg(id, dto));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deletePg(@PathVariable Long id) {

		pgListingService.deletePg(id);

		return ResponseEntity.ok("PG Listing deleted successfully.");
	}

	@GetMapping("/owner/{ownerId}")
	public ResponseEntity<List<PgListingResponseDto>> getPgListingsByOwner(@PathVariable Long ownerId) {

		return ResponseEntity.ok(pgListingService.getPgListingsByOwner(ownerId));
	}

	@GetMapping("/search/city")
	public ResponseEntity<List<PgListingResponseDto>> searchByCity(@RequestParam String city) {

		return ResponseEntity.ok(pgListingService.searchByCity(city));
	}

	@GetMapping("/search/gender")
	public ResponseEntity<List<RoomResponseDto>> searchByGenderPreference(
			@RequestParam GenderPreference genderPreference) {

		return ResponseEntity.ok(pgListingService.searchByGenderPreference(genderPreference));
	}

	@GetMapping("/search/sharing")
	public ResponseEntity<List<RoomResponseDto>> searchBySharingType(@RequestParam SharingType sharingType) {

		return ResponseEntity.ok(pgListingService.searchBySharingType(sharingType));
	}

	@GetMapping("/search/price")
	public ResponseEntity<List<RoomResponseDto>> searchByPriceRange(@RequestParam BigDecimal minPrice,
			@RequestParam BigDecimal maxPrice) {

		return ResponseEntity.ok(pgListingService.searchByPriceRange(minPrice, maxPrice));
	}
}