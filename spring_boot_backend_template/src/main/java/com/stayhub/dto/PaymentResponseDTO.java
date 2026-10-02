package com.stayhub.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.stayhub.enums.PaymentMethod;
import com.stayhub.enums.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponseDTO {

	private Long id;

	private BigDecimal amount;

	@com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd")
	private LocalDate paymentDate;

	private PaymentStatus status;

	private PaymentMethod paymentMethod;

	private String transactionId;

	private String razorpayOrderId;

	private String razorpayPaymentId;

	private Long bookingId;

}