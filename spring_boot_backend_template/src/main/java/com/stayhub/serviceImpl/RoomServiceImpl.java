package com.stayhub.serviceImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.stayhub.dto.RoomRequestDto;
import com.stayhub.dto.RoomResponseDto;
import com.stayhub.entity.PgListing;
import com.stayhub.entity.Room;
import com.stayhub.exception.DuplicateResourceException;
import com.stayhub.exception.ResourceNotFoundException;
import com.stayhub.repository.PgListingRepository;
import com.stayhub.repository.RoomRepository;
import com.stayhub.service.RoomService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

	private final RoomRepository roomRepository;
	private final PgListingRepository pgListingRepository;

	@Override
	public RoomResponseDto createRoom(RoomRequestDto dto) {

		// Check if PG exists
		PgListing pgListing = pgListingRepository.findById(dto.getPgListingId())
				.orElseThrow(() -> new ResourceNotFoundException("PG Listing not found"));

		// Check if room number already exists in this PG
		if (roomRepository.existsByRoomNumberAndPgListingId(dto.getRoomNumber(), dto.getPgListingId())) {

			throw new DuplicateResourceException("Room number already exists in this PG");
		}

		// Create Room
		Room room = new Room();

		room.setRoomNumber(dto.getRoomNumber());
		room.setFloorNumber(dto.getFloorNumber());
		room.setGenderPreference(dto.getGenderPreference());
		room.setSharingType(dto.getSharingType());
		room.setPricePerMonth(dto.getPricePerMonth());
		room.setTotalBeds(dto.getTotalBeds());
		room.setAvailableBeds(dto.getAvailableBeds());
		room.setPgListing(pgListing);

		// Save
		Room savedRoom = roomRepository.save(room);

		return mapToResponse(savedRoom);
	}

	@Override
	public List<RoomResponseDto> getAllRooms() {

		List<Room> rooms = roomRepository.findAll();

		return rooms.stream().map(this::mapToResponse).collect(Collectors.toList());
	}

	@Override
	public RoomResponseDto getRoomById(Long id) {

		Room room = roomRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Room not found"));

		return mapToResponse(room);
	}

	@Override
	public RoomResponseDto updateRoom(Long id, RoomRequestDto dto) {

		// Check if room exists
		Room room = roomRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Room not found"));

		// Check if PG exists
		PgListing pgListing = pgListingRepository.findById(dto.getPgListingId())
				.orElseThrow(() -> new ResourceNotFoundException("PG Listing not found"));

		// Check duplicate room number
		if ((!room.getRoomNumber().equals(dto.getRoomNumber())
				|| !room.getPgListing().getId().equals(dto.getPgListingId()))
				&& roomRepository.existsByRoomNumberAndPgListingId(dto.getRoomNumber(), dto.getPgListingId())) {

			throw new DuplicateResourceException("Room number already exists in this PG");
		}

		// Update Room
		room.setRoomNumber(dto.getRoomNumber());
		room.setFloorNumber(dto.getFloorNumber());
		room.setGenderPreference(dto.getGenderPreference());
		room.setSharingType(dto.getSharingType());
		room.setPricePerMonth(dto.getPricePerMonth());
		room.setTotalBeds(dto.getTotalBeds());
		room.setAvailableBeds(dto.getAvailableBeds());
		room.setPgListing(pgListing);

		Room updatedRoom = roomRepository.save(room);

		return mapToResponse(updatedRoom);
	}

	@Override
	public void deleteRoom(Long id) {

		Room room = roomRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Room not found"));

		roomRepository.delete(room);
	}

	@Override
	public List<RoomResponseDto> getRoomsByPg(Long pgListingId) {

		List<Room> rooms = roomRepository.findByPgListingId(pgListingId);

		return rooms.stream().map(this::mapToResponse).collect(Collectors.toList());
	}

	private RoomResponseDto mapToResponse(Room room) {

		return new RoomResponseDto(room.getId(), room.getRoomNumber(), room.getSharingType(), room.getFloorNumber(),
				room.getTotalBeds(), room.getAvailableBeds(), room.getPricePerMonth(), room.getGenderPreference(),
				room.getPgListing().getId());
	}
}