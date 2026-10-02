package com.stayhub.serviceImpl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stayhub.dto.BookingRequestDTO;
import com.stayhub.dto.BookingResponseDTO;
import com.stayhub.entity.Booking;
import com.stayhub.entity.Room;
import com.stayhub.entity.User;
import com.stayhub.enums.BookingStatus;
import com.stayhub.enums.Role;
import com.stayhub.repository.BookingRepository;
import com.stayhub.repository.PaymentRepository;
import com.stayhub.repository.RoomRepository;
import com.stayhub.repository.UserRepository;
import com.stayhub.service.BookingService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

	private final BookingRepository bookingRepository;
	private final UserRepository userRepository;
	private final RoomRepository roomRepository;
	private final PaymentRepository paymentRepository;

	@Transactional
	@Override
	public BookingResponseDTO createBooking(BookingRequestDTO dto) {

		// Customer exists?
		User customer = userRepository.findById(dto.getCustomerId())
				.orElseThrow(() -> new RuntimeException("Customer not found"));

		// Only CUSTOMER can book
		if (customer.getRole() != Role.CUSTOMER) {
			throw new RuntimeException("Only CUSTOMER can book a room");
		}

		// Room exists?
		Room room = roomRepository.findById(dto.getRoomId()).orElseThrow(() -> new RuntimeException("Room not found"));

		// Customer already booked this room?
		if (bookingRepository.existsByCustomerIdAndRoomId(dto.getCustomerId(), dto.getRoomId())) {

			throw new RuntimeException("Customer has already booked this room.");
		}

		// Room full?
		if (room.getAvailableBeds() <= 0) {
			throw new RuntimeException("No beds available.");
		}

		// Check-in date validation
		if (dto.getCheckInDate() == null) {
			throw new RuntimeException("Check-in date is required.");
		}

		if (dto.getCheckInDate().isBefore(LocalDate.now())) {
			throw new RuntimeException("Check-in date cannot be in the past.");
		}

		// Duration validation
		if (dto.getDurationInMonths() == null || dto.getDurationInMonths() <= 0) {
			throw new RuntimeException("Duration must be greater than zero.");
		}

		// Create booking
		Booking booking = new Booking();

		booking.setBookingDate(LocalDate.now());
		booking.setCheckInDate(dto.getCheckInDate());
		booking.setDurationInMonths(dto.getDurationInMonths());
		booking.setStatus(BookingStatus.PENDING);

		booking.setCustomer(customer);
		booking.setRoom(room);

		// Automatically calculate total amount = room price * duration in months
		BigDecimal totalAmount = room.getPricePerMonth().multiply(BigDecimal.valueOf(dto.getDurationInMonths()));
		booking.setTotalAmount(totalAmount);

		// Reduce available beds
		room.setAvailableBeds(room.getAvailableBeds() - 1);
		roomRepository.save(room);

		Booking savedBooking = bookingRepository.save(booking);

		return mapToResponse(savedBooking);
	}

	private BookingResponseDTO mapToResponse(Booking booking) {

		return new BookingResponseDTO(booking.getId(), booking.getBookingDate(), booking.getCheckInDate(),
				booking.getDurationInMonths(), booking.getStatus(),
				booking.getCustomer().getFirstName() + " " + booking.getCustomer().getLastName(),
				booking.getRoom().getRoomNumber(), booking.getRoom().getPgListing().getPgName(),
				booking.getTotalAmount());
	}

	@Override
	public List<BookingResponseDTO> getAllBookings() {

		List<Booking> bookings = bookingRepository.findAll();

		return bookings.stream().map(this::mapToResponse).toList();
	}

	@Override
	public BookingResponseDTO getBookingById(Long id) {

		Booking booking = bookingRepository.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));

		return mapToResponse(booking);
	}

	@Override
	@Transactional
	public BookingResponseDTO updateBooking(Long id, BookingRequestDTO dto) {

		Booking booking = bookingRepository.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));

		if (dto.getCheckInDate() == null) {
			throw new RuntimeException("Check-in date is required.");
		}

		if (dto.getCheckInDate().isBefore(LocalDate.now())) {
			throw new RuntimeException("Check-in date cannot be in the past.");
		}

		if (dto.getDurationInMonths() == null || dto.getDurationInMonths() <= 0) {
			throw new RuntimeException("Duration must be greater than zero.");
		}

		booking.setCheckInDate(dto.getCheckInDate());
		booking.setDurationInMonths(dto.getDurationInMonths());

		Booking updatedBooking = bookingRepository.save(booking);

		return mapToResponse(updatedBooking);
	}

	@Override
	@Transactional
	public void deleteBooking(Long id) {

		Booking booking = bookingRepository.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));

		// 1. Restore room bed capacity if booking wasn't already cancelled
		if (booking.getStatus() != BookingStatus.CANCELLED) {
			Room room = booking.getRoom();
			if (room.getAvailableBeds() < room.getTotalBeds()) {
				room.setAvailableBeds(room.getAvailableBeds() + 1);
				roomRepository.save(room);
			}
		}

		// 2. Soft-delete: update status to CANCELLED instead of removing row
		booking.setStatus(BookingStatus.CANCELLED);
		bookingRepository.save(booking);
	}

	@Override
	public List<BookingResponseDTO> getBookingsByCustomer(Long customerId) {

		List<Booking> bookings = bookingRepository.findByCustomerId(customerId);

		return bookings.stream().map(this::mapToResponse).toList();
	}

	@Override
	@Transactional
	public BookingResponseDTO confirmBookingStatus(Long id) {

		Booking booking = bookingRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Booking not found"));

		booking.setStatus(BookingStatus.CONFIRMED);
		Booking updatedBooking = bookingRepository.save(booking);

		return mapToResponse(updatedBooking);
	}
}