package com.stayhub.service;

import java.util.List;

import com.stayhub.dto.PaymentRequestDTO;
import com.stayhub.dto.PaymentResponseDTO;
import com.stayhub.dto.PaymentVerifyRequestDTO;

public interface PaymentService {


    // Create Razorpay order and save pending payment
    PaymentResponseDTO createOrder(PaymentRequestDTO dto);



    // Verify Razorpay payment after checkout success
    PaymentResponseDTO verifyPayment(PaymentVerifyRequestDTO dto);



    // Get all payments
    List<PaymentResponseDTO> getAllPayments();



    // Get payment by id
    PaymentResponseDTO getPaymentById(Long id);



    // Get payment using booking id
    PaymentResponseDTO getPaymentByBooking(Long bookingId);



    // Delete payment
    void deletePayment(Long id);

}