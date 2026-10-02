package com.stayhub.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.stayhub.enums.PaymentMethod;
import com.stayhub.enums.PaymentStatus;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "payments")
public class Payment extends BaseEntity {

	@Column(nullable = false, precision = 10, scale = 2)
	private BigDecimal amount;

	@Column(nullable = false)
	private LocalDate paymentDate;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private PaymentStatus status;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private PaymentMethod paymentMethod;

	@Column(length = 100)
	private String transactionId;

	@Column(length = 150)
	private String razorpayOrderId;

	@Column(length = 150)
	private String razorpayPaymentId;

	@OneToOne
	@JoinColumn(name = "booking_id", nullable = false, unique = true)
	private Booking booking;
}