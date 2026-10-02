package com.stayhub.service;

import java.util.List;

import com.stayhub.dto.RoomRequestDto;
import com.stayhub.dto.RoomResponseDto;

public interface RoomService {

	RoomResponseDto createRoom(RoomRequestDto dto);

	List<RoomResponseDto> getAllRooms();

	RoomResponseDto getRoomById(Long id);

	RoomResponseDto updateRoom(Long id, RoomRequestDto dto);

	void deleteRoom(Long id);

	List<RoomResponseDto> getRoomsByPg(Long pgListingId);

}