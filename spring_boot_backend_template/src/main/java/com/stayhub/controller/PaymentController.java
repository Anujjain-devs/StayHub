package com.stayhub.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.stayhub.dto.PaymentRequestDTO;
import com.stayhub.dto.PaymentResponseDTO;
import com.stayhub.dto.PaymentVerifyRequestDTO;
import com.stayhub.service.PaymentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

	private final PaymentService paymentService;

	// =====================================================
	// Create Razorpay Order
	// =====================================================

	@PostMapping("/create-order")
	@ResponseStatus(HttpStatus.CREATED)
	public PaymentResponseDTO createOrder(@RequestBody PaymentRequestDTO dto) {

		return paymentService.createOrder(dto);

	}

	// =====================================================
	// Verify Razorpay Payment
	// =====================================================

	@PostMapping("/verify")
	public PaymentResponseDTO verifyPayment(@RequestBody PaymentVerifyRequestDTO dto) {

		return paymentService.verifyPayment(dto);

	}

	// =====================================================
	// Get All Payments
	// =====================================================

	@GetMapping
	public List<PaymentResponseDTO> getAllPayments() {

		return paymentService.getAllPayments();

	}

	// =====================================================
	// Get Payment By ID
	// =====================================================

	@GetMapping("/{id}")
	public PaymentResponseDTO getPaymentById(@PathVariable Long id) {

		return paymentService.getPaymentById(id);

	}

	// =====================================================
	// Get Payment By Booking
	// =====================================================

	@GetMapping("/booking/{bookingId}")
	public PaymentResponseDTO getPaymentByBooking(@PathVariable Long bookingId) {

		return paymentService.getPaymentByBooking(bookingId);

	}

	// =====================================================
	// Delete Payment
	// =====================================================

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deletePayment(@PathVariable Long id) {

		paymentService.deletePayment(id);

	}

}