package com.stayhub.service;

import java.math.BigDecimal;
import java.util.List;

import com.stayhub.dto.PgListingRequestDto;
import com.stayhub.dto.PgListingResponseDto;
import com.stayhub.dto.RoomResponseDto;
import com.stayhub.enums.GenderPreference;
import com.stayhub.enums.SharingType;

public interface PgListingService {

	PgListingResponseDto createPg(PgListingRequestDto dto);

	List<PgListingResponseDto> getAllPgListings();

	PgListingResponseDto getPgListingById(Long id);

	PgListingResponseDto updatePg(Long id, PgListingRequestDto dto);

	void deletePg(Long id);

	List<PgListingResponseDto> getPgListingsByOwner(Long ownerId);

	List<PgListingResponseDto> searchByCity(String city);

	List<RoomResponseDto> searchByGenderPreference(GenderPreference genderPreference);

	List<RoomResponseDto> searchBySharingType(SharingType sharingType);

	List<RoomResponseDto> searchByPriceRange(BigDecimal minPrice, BigDecimal maxPrice);
	
	

}