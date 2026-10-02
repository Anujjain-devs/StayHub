package com.stayhub.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ListingImageRequestDTO {

    private String imageName;

    private String imageUrl;

    private Long pgListingId;

}