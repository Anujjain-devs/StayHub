package com.stayhub.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stayhub.dto.RoomRequestDto;
import com.stayhub.dto.RoomResponseDto;
import com.stayhub.service.RoomService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

	private final RoomService roomService;

	// Create Room
	@PostMapping
	public ResponseEntity<RoomResponseDto> createRoom(@RequestBody RoomRequestDto dto) {

		return new ResponseEntity<>(roomService.createRoom(dto), HttpStatus.CREATED);
	}

	// Get All Rooms
	@GetMapping
	public ResponseEntity<List<RoomResponseDto>> getAllRooms() {

		return ResponseEntity.ok(roomService.getAllRooms());
	}

	// Get Room By Id
	@GetMapping("/{id}")
	public ResponseEntity<RoomResponseDto> getRoomById(@PathVariable Long id) {

		return ResponseEntity.ok(roomService.getRoomById(id));
	}

	// Update Room
	@PutMapping("/{id}")
	public ResponseEntity<RoomResponseDto> updateRoom(@PathVariable Long id, @RequestBody RoomRequestDto dto) {

		return ResponseEntity.ok(roomService.updateRoom(id, dto));
	}

	// Delete Room
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteRoom(@PathVariable Long id) {

		roomService.deleteRoom(id);

		return ResponseEntity.ok("Room deleted successfully.");
	}

	// Get All Rooms of a PG
	@GetMapping("/pg/{pgListingId}")
	public ResponseEntity<List<RoomResponseDto>> getRoomsByPg(@PathVariable Long pgListingId) {

		return ResponseEntity.ok(roomService.getRoomsByPg(pgListingId));
	}
}