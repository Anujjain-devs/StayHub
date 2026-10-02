package com.stayhub.service;

import java.util.List;

import com.stayhub.dto.BookingRequestDTO;
import com.stayhub.dto.BookingResponseDTO;

public interface BookingService {

	BookingResponseDTO createBooking(BookingRequestDTO dto);

	List<BookingResponseDTO> getAllBookings();

	BookingResponseDTO getBookingById(Long id);

	BookingResponseDTO updateBooking(Long id, BookingRequestDTO dto);

	void deleteBooking(Long id);

	List<BookingResponseDTO> getBookingsByCustomer(Long customerId);

	BookingResponseDTO confirmBookingStatus(Long id);

}
