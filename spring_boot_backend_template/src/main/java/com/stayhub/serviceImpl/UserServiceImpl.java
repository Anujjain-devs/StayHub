package com.stayhub.serviceImpl;

import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stayhub.dto.UserRequestDto;
import com.stayhub.dto.UserResponseDto;
import com.stayhub.entity.Amenity;
import com.stayhub.entity.Booking;
import com.stayhub.entity.ListingImage;
import com.stayhub.entity.PgListing;
import com.stayhub.entity.Room;
import com.stayhub.entity.User;
import com.stayhub.exception.DuplicateResourceException;
import com.stayhub.exception.ResourceNotFoundException;
import com.stayhub.repository.AmenityRepository;
import com.stayhub.repository.BookingRepository;
import com.stayhub.repository.ListingImageRepository;
import com.stayhub.repository.PaymentRepository;
import com.stayhub.repository.PgListingRepository;
import com.stayhub.repository.RoomRepository;
import com.stayhub.repository.UserRepository;
import com.stayhub.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
	private final PasswordEncoder passwordEncoder;
	private final UserRepository userRepository;
	private final BookingRepository bookingRepository;
	private final PaymentRepository paymentRepository;
	private final PgListingRepository pgListingRepository;
	private final RoomRepository roomRepository;
	private final AmenityRepository amenityRepository;
	private final ListingImageRepository listingImageRepository;

	@Override
	public UserResponseDto register(UserRequestDto dto) {

		// Check duplicate email
		if (userRepository.existsByEmail(dto.getEmail())) {
			throw new DuplicateResourceException("Email already exists");
		}

		User user = new User();

		user.setFirstName(dto.getFirstName());
		user.setLastName(dto.getLastName());
		user.setEmail(dto.getEmail());
		user.setPassword(passwordEncoder.encode(dto.getPassword()));
		user.setPhoneNumber(dto.getPhoneNumber());
		user.setRole(dto.getRole());

		User savedUser = userRepository.save(user);

		return mapToResponse(savedUser);
	}

	@Override
	public List<UserResponseDto> getAllUsers() {

		return userRepository.findAll().stream().map(this::mapToResponse).toList();
	}

	@Override
	public UserResponseDto getUserById(Long id) {

		User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));

		return mapToResponse(user);
	}

	@Override
	public UserResponseDto updateUser(Long id, UserRequestDto dto) {

		// Check if user exists
		User existingUser = userRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		// Check duplicate email
		if (!existingUser.getEmail().equals(dto.getEmail()) && userRepository.existsByEmail(dto.getEmail())) {

			throw new DuplicateResourceException("Email already exists");
		}

		existingUser.setFirstName(dto.getFirstName());
		existingUser.setLastName(dto.getLastName());
		existingUser.setEmail(dto.getEmail());
		if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) {
			existingUser.setPassword(passwordEncoder.encode(dto.getPassword()));
		}
		existingUser.setPhoneNumber(dto.getPhoneNumber());
		existingUser.setRole(dto.getRole());

		User updatedUser = userRepository.save(existingUser);

		return mapToResponse(updatedUser);
	}

	@Override
	@Transactional
	public void deleteUser(Long id) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

		log.info("Deleting user ID {} ({}) and all associated records...", id, user.getEmail());

		// 1. Delete all bookings & payments where user is Customer
		List<Booking> customerBookings = bookingRepository.findByCustomerId(id);
		for (Booking b : customerBookings) {
			paymentRepository.findByBookingId(b.getId()).ifPresent(paymentRepository::delete);
			bookingRepository.delete(b);
		}

		// 2. Delete all PG listings, rooms, amenities, photos & room bookings where user is Owner
		List<PgListing> ownerPgs = pgListingRepository.findByOwnerId(id);
		for (PgListing pg : ownerPgs) {
			List<Room> rooms = roomRepository.findByPgListingId(pg.getId());
			for (Room room : rooms) {
				List<Booking> roomBookings = bookingRepository.findByRoomId(room.getId());
				for (Booking rb : roomBookings) {
					paymentRepository.findByBookingId(rb.getId()).ifPresent(paymentRepository::delete);
					bookingRepository.delete(rb);
				}
				roomRepository.delete(room);
			}

			List<Amenity> amenities = amenityRepository.findByPgListingId(pg.getId());
			amenityRepository.deleteAll(amenities);

			List<ListingImage> images = listingImageRepository.findByPgListingId(pg.getId());
			listingImageRepository.deleteAll(images);

			pgListingRepository.delete(pg);
		}

		// 3. Delete user record
		userRepository.delete(user);
		log.info("User ID {} and all associated records deleted successfully.", id);
	}

	private UserResponseDto mapToResponse(User user) {

		return new UserResponseDto(user.getId(), user.getFirstName(), user.getLastName(), user.getEmail(),
				user.getPhoneNumber(), user.getRole());
	}
}