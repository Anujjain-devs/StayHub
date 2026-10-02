package com.stayhub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.stayhub.entity.Amenity;

public interface AmenityRepository extends JpaRepository<Amenity, Long> {

	List<Amenity> findByPgListingId(Long pgListingId);

	boolean existsByNameAndPgListingId(String name, Long pgListingId);
}