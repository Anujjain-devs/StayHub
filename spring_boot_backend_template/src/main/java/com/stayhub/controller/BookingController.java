package com.stayhub.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stayhub.dto.BookingRequestDTO;
import com.stayhub.dto.BookingResponseDTO;
import com.stayhub.service.BookingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

	private final BookingService bookingService;

	@PostMapping
	public BookingResponseDTO createBooking(@RequestBody BookingRequestDTO dto) {
		return bookingService.createBooking(dto);
	}

	@GetMapping
	public List<BookingResponseDTO> getAllBookings() {
		return bookingService.getAllBookings();
	}

	@GetMapping("/{id}")
	public BookingResponseDTO getBookingById(@PathVariable Long id) {
		return bookingService.getBookingById(id);
	}

	@PutMapping("/{id}")
	public BookingResponseDTO updateBooking(@PathVariable Long id, @RequestBody BookingRequestDTO dto) {

		return bookingService.updateBooking(id, dto);
	}

	@DeleteMapping("/{id}")
	public void deleteBooking(@PathVariable Long id) {
		bookingService.deleteBooking(id);
	}

	@GetMapping("/customer/{customerId}")
	public List<BookingResponseDTO> getBookingsByCustomer(@PathVariable Long customerId) {

		return bookingService.getBookingsByCustomer(customerId);
	}

	@PutMapping("/{id}/confirm-status")
	public BookingResponseDTO confirmBookingStatus(@PathVariable Long id) {

		return bookingService.confirmBookingStatus(id);
	}
}
