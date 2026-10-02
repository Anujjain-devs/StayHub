package com.stayhub.serviceImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.stayhub.dto.PaymentRequestDTO;
import com.stayhub.dto.PaymentResponseDTO;
import com.stayhub.dto.PaymentVerifyRequestDTO;
import com.stayhub.entity.Payment;
import com.stayhub.exception.ResourceNotFoundException;
import com.stayhub.repository.PaymentRepository;
import com.stayhub.service.PaymentService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

	private final PaymentRepository paymentRepository;
	private final RestTemplate restTemplate = new RestTemplate();

	@Value("${dotnet.payment-service.url:http://localhost:5050/api/payments}")
	private String dotnetPaymentServiceUrl;

	private HttpEntity<?> createRequestWithAuthHeader(Object body) {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
		if (attributes != null) {
			HttpServletRequest request = attributes.getRequest();
			String authHeader = request.getHeader("Authorization");
			if (authHeader != null) {
				headers.set("Authorization", authHeader);
			}
		}
		return new HttpEntity<>(body, headers);
	}

	// =====================================================
	// Create Razorpay Order via .NET Payment Microservice
	// =====================================================

	@Override
	public PaymentResponseDTO createOrder(PaymentRequestDTO dto) {
		try {
			String url = dotnetPaymentServiceUrl + "/create-order";
			HttpEntity<?> entity = createRequestWithAuthHeader(dto);
			ResponseEntity<PaymentResponseDTO> response = restTemplate.exchange(url, HttpMethod.POST, entity,
					PaymentResponseDTO.class);
			return response.getBody();
		} catch (Exception e) {
			throw new RuntimeException(".NET Payment Microservice unavailable: " + e.getMessage(), e);
		}
	}

	// =====================================================
	// Verify Razorpay Payment via .NET Payment Microservice
	// =====================================================

	@Override
	public PaymentResponseDTO verifyPayment(PaymentVerifyRequestDTO dto) {
		try {
			String url = dotnetPaymentServiceUrl + "/verify";
			HttpEntity<?> entity = createRequestWithAuthHeader(dto);
			ResponseEntity<PaymentResponseDTO> response = restTemplate.exchange(url, HttpMethod.POST, entity,
					PaymentResponseDTO.class);
			return response.getBody();
		} catch (Exception e) {
			throw new RuntimeException(".NET Payment Microservice verification failed: " + e.getMessage(), e);
		}
	}

	// =====================================================
	// Get All Payments (Reads from shared MySQL payments table)
	// =====================================================

	@Override
	public List<PaymentResponseDTO> getAllPayments() {
		return paymentRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
	}

	// =====================================================
	// Get Payment By ID
	// =====================================================

	@Override
	public PaymentResponseDTO getPaymentById(Long id) {
		Payment payment = paymentRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

		return mapToResponse(payment);
	}

	// =====================================================
	// Get Payment By Booking
	// =====================================================

	@Override
	public PaymentResponseDTO getPaymentByBooking(Long bookingId) {
		Payment payment = paymentRepository.findByBookingId(bookingId)
				.orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

		return mapToResponse(payment);
	}

	// =====================================================
	// Delete Payment
	// =====================================================

	@Override
	public void deletePayment(Long id) {
		Payment payment = paymentRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

		paymentRepository.delete(payment);
	}

	// =====================================================
	// Entity -> DTO Mapping
	// =====================================================

	private PaymentResponseDTO mapToResponse(Payment payment) {
		return new PaymentResponseDTO(
				payment.getId(),
				payment.getAmount(),
				payment.getPaymentDate(),
				payment.getStatus(),
				payment.getPaymentMethod(),
				payment.getTransactionId(),
				payment.getRazorpayOrderId(),
				payment.getRazorpayPaymentId(),
				payment.getBooking().getId()
		);
	}
}