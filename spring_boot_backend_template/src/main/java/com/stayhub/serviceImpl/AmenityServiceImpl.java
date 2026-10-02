package com.stayhub.serviceImpl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.stayhub.dto.AmenityRequestDto;
import com.stayhub.dto.AmenityResponseDto;
import com.stayhub.entity.Amenity;
import com.stayhub.entity.PgListing;
import com.stayhub.exception.DuplicateResourceException;
import com.stayhub.exception.ResourceNotFoundException;
import com.stayhub.repository.AmenityRepository;
import com.stayhub.repository.PgListingRepository;
import com.stayhub.service.AmenityService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AmenityServiceImpl implements AmenityService {

	private final AmenityRepository amenityRepository;
	private final PgListingRepository pgListingRepository;

	private AmenityResponseDto mapToResponse(Amenity amenity) {

		return new AmenityResponseDto(amenity.getId(), amenity.getName(), amenity.getPgListing().getId());
	}

	@Override
	public AmenityResponseDto createAmenity(AmenityRequestDto dto) {

		// Check whether the PG exists
		PgListing pgListing = pgListingRepository.findById(dto.getPgListingId())
				.orElseThrow(() -> new ResourceNotFoundException("PG Listing not found"));

		// Prevent duplicate amenity names in the same PG
		if (amenityRepository.existsByNameAndPgListingId(dto.getName(), dto.getPgListingId())) {
			throw new DuplicateResourceException("Amenity already exists for this PG");
		}

		// Create Amenity object
		Amenity amenity = new Amenity();

		amenity.setName(dto.getName());
		amenity.setPgListing(pgListing);

		// Save into DB
		Amenity savedAmenity = amenityRepository.save(amenity);

		// Return DTO
		return mapToResponse(savedAmenity);
	}

	@Override
	public List<AmenityResponseDto> getAllAmenities() {

		return amenityRepository.findAll().stream().map(this::mapToResponse).toList();
	}

	@Override
	public AmenityResponseDto getAmenityById(Long id) {

		Amenity amenity = amenityRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Amenity not found"));

		return mapToResponse(amenity);
	}

	@Override
	public AmenityResponseDto updateAmenity(Long id, AmenityRequestDto dto) {

		// Check if Amenity exists
		Amenity amenity = amenityRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Amenity not found"));

		// Check if PG exists
		PgListing pgListing = pgListingRepository.findById(dto.getPgListingId())
				.orElseThrow(() -> new ResourceNotFoundException("PG Listing not found"));

		// Prevent duplicate amenity names in same PG
		if (!amenity.getName().equals(dto.getName())
				&& amenityRepository.existsByNameAndPgListingId(dto.getName(), dto.getPgListingId())) {

			throw new DuplicateResourceException("Amenity already exists for this PG");
		}

		// Update values
		amenity.setName(dto.getName());
		amenity.setPgListing(pgListing);

		Amenity updatedAmenity = amenityRepository.save(amenity);

		return mapToResponse(updatedAmenity);
	}

	@Override
	public void deleteAmenity(Long id) {

		Amenity amenity = amenityRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Amenity not found"));

		amenityRepository.delete(amenity);
	}

	@Override
	public List<AmenityResponseDto> getAmenitiesByPg(Long pgListingId) {

		return amenityRepository.findByPgListingId(pgListingId).stream().map(this::mapToResponse).toList();
	}
}