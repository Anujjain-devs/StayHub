package com.stayhub.serviceImpl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import com.stayhub.dto.ListingImageResponseDTO;
import com.stayhub.entity.ListingImage;
import com.stayhub.entity.PgListing;
import com.stayhub.exception.ResourceNotFoundException;
import com.stayhub.repository.ListingImageRepository;
import com.stayhub.repository.PgListingRepository;
import com.stayhub.service.ListingImageService;
import org.springframework.beans.factory.annotation.Value;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ListingImageServiceImpl implements ListingImageService {

	private final ListingImageRepository listingImageRepository;
	private final PgListingRepository pgListingRepository;
	@Value("${file.upload-dir}")
	private String uploadDir;
//	private static final String UPLOAD_DIR = "uploads/";

	@Override
	public ListingImageResponseDTO uploadImage(Long pgId, MultipartFile file) {

		// Check if PG exists
		PgListing pgListing = pgListingRepository.findById(pgId)
				.orElseThrow(() -> new ResourceNotFoundException("PG Listing not found"));

		try {

			// Create uploads folder if it doesn't exist
			Path uploadPath = Paths.get(uploadDir);

			if (!Files.exists(uploadPath)) {
				Files.createDirectories(uploadPath);
			}

			// Generate unique filename
			String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

			// Save file
			Path filePath = uploadPath.resolve(fileName);
			Files.copy(file.getInputStream(), filePath);

			// Create image entity
			ListingImage image = new ListingImage();

			image.setImageName(fileName);

			image.setImageUrl("/uploads/" + fileName);

			image.setPgListing(pgListing);

			// Save to DB
			ListingImage savedImage = listingImageRepository.save(image);

			return mapToResponse(savedImage);

		} catch (IOException e) {

			throw new RuntimeException("Failed to upload image", e);

		}
	}

	@Override
	public List<ListingImageResponseDTO> getAllImages() {

		return listingImageRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
	}

	@Override
	public ListingImageResponseDTO getImageById(Long id) {

		ListingImage image = listingImageRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Image not found"));

		return mapToResponse(image);
	}

	@Override
	public List<ListingImageResponseDTO> getImagesByPg(Long pgListingId) {

		return listingImageRepository.findByPgListingId(pgListingId).stream().map(this::mapToResponse)
				.collect(Collectors.toList());
	}

	@Override
	public void deleteImage(Long id) {

		// Check if image exists
		ListingImage image = listingImageRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Image not found"));

		try {

			// Get file path
			Path filePath = Paths.get(uploadDir).resolve(image.getImageName());

			System.out.println("Upload Dir : " + uploadDir);
			System.out.println("Deleting : " + filePath.toAbsolutePath());
			System.out.println("Exists : " + Files.exists(filePath));

			Files.deleteIfExists(filePath);

			// Delete file if present
			Files.deleteIfExists(filePath);

		} catch (IOException e) {

			throw new RuntimeException("Failed to delete image file", e);

		}

		// Delete DB record
		listingImageRepository.delete(image);
	}

	// Entity -> DTO
	private ListingImageResponseDTO mapToResponse(ListingImage image) {

		return new ListingImageResponseDTO(image.getId(), image.getImageName(), image.getImageUrl(),
				image.getPgListing().getId());
	}
}