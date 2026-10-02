package com.stayhub.serviceImpl;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stayhub.dto.PgListingRequestDto;
import com.stayhub.dto.PgListingResponseDto;
import com.stayhub.dto.RoomResponseDto;
import com.stayhub.entity.Amenity;
import com.stayhub.entity.Booking;
import com.stayhub.entity.ListingImage;
import com.stayhub.entity.PgListing;
import com.stayhub.entity.Room;
import com.stayhub.entity.User;
import com.stayhub.enums.GenderPreference;
import com.stayhub.enums.Role;
import com.stayhub.enums.SharingType;
import com.stayhub.exception.BadRequestException;
import com.stayhub.exception.ResourceNotFoundException;
import com.stayhub.repository.AmenityRepository;
import com.stayhub.repository.BookingRepository;
import com.stayhub.repository.ListingImageRepository;
import com.stayhub.repository.PaymentRepository;
import com.stayhub.repository.PgListingRepository;
import com.stayhub.repository.RoomRepository;
import com.stayhub.repository.UserRepository;
import com.stayhub.security.SecurityUtils;
import com.stayhub.service.PgListingService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PgListingServiceImpl implements PgListingService {

	private final PgListingRepository pgListingRepository;
	private final RoomRepository roomRepository;
	private final UserRepository userRepository;
	private final BookingRepository bookingRepository;
	private final PaymentRepository paymentRepository;
	private final AmenityRepository amenityRepository;
	private final ListingImageRepository listingImageRepository;

	@Override
	public PgListingResponseDto createPg(PgListingRequestDto dto) {

		// Check if owner exists
		User owner = userRepository.findById(dto.getOwnerId())
				.orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

		// Only OWNER can create PG
		if (owner.getRole() != Role.OWNER) {
			throw new BadRequestException("Only OWNER can create PG Listings");
		}

		PgListing pgListing = new PgListing();

		pgListing.setPgName(dto.getPgName());
		pgListing.setDescription(dto.getDescription());
		pgListing.setAddress(dto.getAddress());
		pgListing.setCity(dto.getCity());
		pgListing.setState(dto.getState());
		pgListing.setPincode(dto.getPincode());
		pgListing.setStatus(dto.getStatus());
		pgListing.setOwner(owner);

		PgListing savedPg = pgListingRepository.save(pgListing);

		return mapToResponse(savedPg);
	}

	// ===========================
	// SEARCH APIs
	// ===========================

	@Override
	public List<PgListingResponseDto> searchByCity(String city) {

		return pgListingRepository.findByCityIgnoreCase(city).stream().map(this::mapToResponse).toList();
	}

	@Override
	public List<RoomResponseDto> searchByGenderPreference(GenderPreference genderPreference) {

		return roomRepository.findByGenderPreference(genderPreference).stream().map(this::mapRoomToResponse).toList();
	}

	@Override
	public List<RoomResponseDto> searchBySharingType(SharingType sharingType) {

		return roomRepository.findBySharingType(sharingType).stream().map(this::mapRoomToResponse).toList();
	}

	@Override
	public List<RoomResponseDto> searchByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {

		return roomRepository.findByPricePerMonthBetween(minPrice, maxPrice).stream().map(this::mapRoomToResponse)
				.toList();
	}

	@Override
	public PgListingResponseDto updatePg(Long id, PgListingRequestDto dto) {

		// Check if PG exists
		PgListing pg = pgListingRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("PG Listing not found"));

		User currentUser = SecurityUtils.getCurrentUser().getUser();

		if (currentUser.getRole() == Role.CUSTOMER) {
			throw new AccessDeniedException("Customers cannot update PG Listings");
		}

		// Owner can update only his own PG
		if (currentUser.getRole() == Role.OWNER && !pg.getOwner().getId().equals(currentUser.getId())) {
			throw new AccessDeniedException("You can update only your own PG");
		}

		pg.setPgName(dto.getPgName());
		pg.setDescription(dto.getDescription());
		pg.setAddress(dto.getAddress());
		pg.setCity(dto.getCity());
		pg.setState(dto.getState());
		pg.setPincode(dto.getPincode());
		pg.setStatus(dto.getStatus());

		PgListing updatedPg = pgListingRepository.save(pg);

		return mapToResponse(updatedPg);
	}

	@Override
	public List<PgListingResponseDto> getAllPgListings() {

		return pgListingRepository.findAll().stream().map(this::mapToResponse).toList();
	}

	@Override
	public PgListingResponseDto getPgListingById(Long id) {

		PgListing pg = pgListingRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("PG Listing not found"));

		return mapToResponse(pg);
	}

	@Override
	@Transactional
	public void deletePg(Long id) {

		// Check if PG exists
		PgListing pg = pgListingRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("PG Listing not found"));

		User currentUser = SecurityUtils.getCurrentUser().getUser();

		if (currentUser.getRole() == Role.CUSTOMER) {
			throw new AccessDeniedException("Customers cannot delete PG Listings");
		}

		// Owner can delete only his own PG
		if (currentUser.getRole() == Role.OWNER && !pg.getOwner().getId().equals(currentUser.getId())) {
			throw new AccessDeniedException("You can delete only your own PG");
		}

		// 1. Delete all rooms, room bookings, and payments under this PG
		List<Room> rooms = roomRepository.findByPgListingId(pg.getId());
		for (Room room : rooms) {
			List<Booking> roomBookings = bookingRepository.findByRoomId(room.getId());
			for (Booking rb : roomBookings) {
				paymentRepository.findByBookingId(rb.getId()).ifPresent(paymentRepository::delete);
				bookingRepository.delete(rb);
			}
			roomRepository.delete(room);
		}

		// 2. Delete amenities & gallery images under this PG
		List<Amenity> amenities = amenityRepository.findByPgListingId(pg.getId());
		amenityRepository.deleteAll(amenities);

		List<ListingImage> images = listingImageRepository.findByPgListingId(pg.getId());
		listingImageRepository.deleteAll(images);

		// 3. Delete PG listing entity
		pgListingRepository.delete(pg);
	}

	@Override
	public List<PgListingResponseDto> getPgListingsByOwner(Long ownerId) {

		return pgListingRepository.findByOwnerId(ownerId).stream().map(this::mapToResponse).toList();
	}

	// ===========================
	// MAPPING METHODS
	// ===========================

	private PgListingResponseDto mapToResponse(PgListing pg) {

		return new PgListingResponseDto(pg.getId(), pg.getPgName(), pg.getDescription(), pg.getAddress(), pg.getCity(),
				pg.getState(), pg.getPincode(), pg.getStatus(), pg.getOwner().getId());
	}

	private RoomResponseDto mapRoomToResponse(Room room) {

		return new RoomResponseDto(room.getId(), room.getRoomNumber(), room.getSharingType(), room.getFloorNumber(),
				room.getTotalBeds(), room.getAvailableBeds(), room.getPricePerMonth(), room.getGenderPreference(),
				room.getPgListing().getId());
	}
}