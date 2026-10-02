package com.stayhub.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentVerifyRequestDTO {

	private String razorpayOrderId;

	private String razorpayPaymentId;

	private String razorpaySignature;

}