package com.stayhub.service;

import java.util.List;

import com.stayhub.dto.AmenityRequestDto;
import com.stayhub.dto.AmenityResponseDto;

public interface AmenityService {

	AmenityResponseDto createAmenity(AmenityRequestDto dto);

	List<AmenityResponseDto> getAllAmenities();

	AmenityResponseDto getAmenityById(Long id);

	AmenityResponseDto updateAmenity(Long id, AmenityRequestDto dto);

	void deleteAmenity(Long id);

	List<AmenityResponseDto> getAmenitiesByPg(Long pgListingId);
}
