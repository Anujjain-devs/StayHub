package com.stayhub.entity;

import java.math.BigDecimal;

import com.stayhub.enums.GenderPreference;
import com.stayhub.enums.SharingType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.UniqueConstraint;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(
	    name = "rooms",
	    uniqueConstraints = {
	        @UniqueConstraint(columnNames = {"room_number", "pg_listing_id"})
	    }
	)
public class Room extends BaseEntity {

	@Column(nullable = false, length = 20)
	private String roomNumber;

	@Column(nullable = false)
	private Integer floorNumber;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private GenderPreference genderPreference;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private SharingType sharingType;

	@Column(nullable = false, precision = 10, scale = 2)
	private BigDecimal pricePerMonth;

	@Column(nullable = false)
	private Integer totalBeds;

	@Column(nullable = false)
	private Integer availableBeds;

	@ManyToOne
	@JoinColumn(name = "pg_listing_id", nullable = false)
	private PgListing pgListing;
}