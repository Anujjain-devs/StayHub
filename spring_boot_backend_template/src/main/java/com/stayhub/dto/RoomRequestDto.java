package com.stayhub.dto;

import java.math.BigDecimal;

import com.stayhub.enums.GenderPreference;
import com.stayhub.enums.SharingType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomRequestDto {

	private String roomNumber;

	private SharingType sharingType;

	private Integer floorNumber;

	private Integer totalBeds;

	private Integer availableBeds;

	private BigDecimal pricePerMonth;

	private GenderPreference genderPreference;

	private Long pgListingId;

}