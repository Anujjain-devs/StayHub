package com.stayhub.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.stayhub.entity.Room;
import com.stayhub.enums.GenderPreference;
import com.stayhub.enums.SharingType;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    List<Room> findByPgListingId(Long pgListingId);

    boolean existsByRoomNumberAndPgListingId(String roomNumber, Long pgListingId);

    // Search by Gender
    List<Room> findByGenderPreference(GenderPreference genderPreference);

    // Search by Sharing Type
    List<Room> findBySharingType(SharingType sharingType);

    // Search by Price Range
    List<Room> findByPricePerMonthBetween(BigDecimal minPrice, BigDecimal maxPrice);

}