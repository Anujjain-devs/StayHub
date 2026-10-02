package com.stayhub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.stayhub.entity.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

	boolean existsByCustomerIdAndRoomId(Long customerId, Long roomId);
    List<Booking> findByCustomerId(Long customerId);
    List<Booking> findByRoomId(Long roomId);

}