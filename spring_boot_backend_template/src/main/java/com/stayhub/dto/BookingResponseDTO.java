package com.stayhub.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.stayhub.enums.BookingStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class BookingResponseDTO {

	private Long id;

	private LocalDate bookingDate;

	private LocalDate checkInDate;

	private Integer durationInMonths;

	private BookingStatus status;

	private String customerName;

	private String roomNumber;

	private String pgName;

	private BigDecimal totalAmount;

}
