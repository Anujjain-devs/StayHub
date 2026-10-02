package com.stayhub.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ListingImageResponseDTO {

	private Long id;

	private String imageName;

	private String imageUrl;

	private Long pgListingId;

}