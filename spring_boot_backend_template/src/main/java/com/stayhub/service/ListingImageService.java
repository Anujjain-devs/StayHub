package com.stayhub.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.stayhub.dto.ListingImageResponseDTO;

public interface ListingImageService {

	// Upload image file for a PG
	ListingImageResponseDTO uploadImage(Long pgId, MultipartFile file);

	// Get all images
	List<ListingImageResponseDTO> getAllImages();

	// Get image by ID
	ListingImageResponseDTO getImageById(Long id);

	// Get all images of a PG
	List<ListingImageResponseDTO> getImagesByPg(Long pgListingId);

	// Delete image
	void deleteImage(Long id);
}