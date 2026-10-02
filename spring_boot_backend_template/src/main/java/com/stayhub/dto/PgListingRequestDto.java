package com.stayhub.dto;

import com.stayhub.enums.PgStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PgListingRequestDto {

    private String pgName;

    private String description;

    private String address;

    private String city;

    private String state;

    private String pincode;

    private PgStatus status;

    private Long ownerId;
}