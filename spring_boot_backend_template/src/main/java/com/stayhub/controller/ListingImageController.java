package com.stayhub.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import com.stayhub.dto.ListingImageResponseDTO;
import com.stayhub.service.ListingImageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/listing-images")
@RequiredArgsConstructor
public class ListingImageController {

	private final ListingImageService listingImageService;

	// ==========================
	// Upload Image
	// ==========================
	
	@PostMapping(
	        value = "/upload/{pgId}",
	        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
	)
	@ResponseStatus(HttpStatus.CREATED)
	public ListingImageResponseDTO uploadImage(

	        @PathVariable Long pgId,

	        @RequestPart("file") MultipartFile file) {

	    return listingImageService.uploadImage(pgId, file);
	}

	// ==========================
	// Get All Images
	// ==========================
	@GetMapping
	public List<ListingImageResponseDTO> getAllImages() {
		return listingImageService.getAllImages();
	}

	// ==========================
	// Get Image By ID
	// ==========================
	@GetMapping("/{id}")
	public ListingImageResponseDTO getImageById(@PathVariable Long id) {
		return listingImageService.getImageById(id);
	}

	// ==========================
	// Get Images By PG
	// ==========================
	@GetMapping("/pg/{pgListingId}")
	public List<ListingImageResponseDTO> getImagesByPg(@PathVariable Long pgListingId) {
		return listingImageService.getImagesByPg(pgListingId);
	}

	// ==========================
	// Delete Image
	// ==========================
	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteImage(@PathVariable Long id) {
		listingImageService.deleteImage(id);
	}
}