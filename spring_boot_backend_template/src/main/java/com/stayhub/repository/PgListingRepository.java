package com.stayhub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.stayhub.entity.PgListing;

@Repository
public interface PgListingRepository extends JpaRepository<PgListing, Long> {

	// Search PGs by city
	List<PgListing> findByCityIgnoreCase(String city);

	// Get all PGs owned by a specific owner
	List<PgListing> findByOwnerId(Long ownerId);

}