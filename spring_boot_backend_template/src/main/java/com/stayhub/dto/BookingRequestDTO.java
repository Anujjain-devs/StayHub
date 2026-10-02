package com.stayhub.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingRequestDTO {

	private LocalDate checkInDate;

	private Integer durationInMonths;

	private Long customerId;

	private Long roomId;

}