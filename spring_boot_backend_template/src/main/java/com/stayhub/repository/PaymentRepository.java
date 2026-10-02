package com.stayhub.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.stayhub.entity.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

	Optional<Payment> findByBookingId(Long bookingId);

	boolean existsByBookingId(Long bookingId);

	Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);
}