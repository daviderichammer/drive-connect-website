-- Phase 4 Migration: Host Dashboard Additions
-- Run on drive_connect database

-- Create Messages table for host-renter communication
CREATE TABLE IF NOT EXISTS messages (
  id INT NOT NULL AUTO_INCREMENT,
  bookingId INT NULL,
  hostId INT NOT NULL,
  renterEmail VARCHAR(255) NOT NULL,
  senderType VARCHAR(50) NOT NULL, -- 'host', 'renter', 'system'
  content TEXT NOT NULL,
  isRead TINYINT(1) NOT NULL DEFAULT 0,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  INDEX idx_messages_booking (bookingId),
  INDEX idx_messages_host (hostId),
  CONSTRAINT fk_messages_booking FOREIGN KEY (bookingId) REFERENCES bookings(id) ON DELETE SET NULL,
  CONSTRAINT fk_messages_host FOREIGN KEY (hostId) REFERENCES host_accounts(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Claims table for damage reporting
CREATE TABLE IF NOT EXISTS claims (
  id INT NOT NULL AUTO_INCREMENT,
  claimReference VARCHAR(50) NOT NULL,
  bookingId INT NOT NULL,
  hostId INT NOT NULL,
  vehicleId INT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'open', -- 'open', 'pending_review', 'approved', 'denied', 'closed'
  description TEXT NOT NULL,
  photos TEXT NULL, -- JSON array of URLs
  estimatedCost DECIMAL(10,2) NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uk_claim_ref (claimReference),
  INDEX idx_claims_booking (bookingId),
  INDEX idx_claims_host (hostId),
  CONSTRAINT fk_claims_booking FOREIGN KEY (bookingId) REFERENCES bookings(id),
  CONSTRAINT fk_claims_host FOREIGN KEY (hostId) REFERENCES host_accounts(id),
  CONSTRAINT fk_claims_vehicle FOREIGN KEY (vehicleId) REFERENCES vehicles(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add payouts tracking columns to bookings if they don't exist
DROP PROCEDURE IF EXISTS add_booking_payout_columns;
DELIMITER //
CREATE PROCEDURE add_booking_payout_columns()
BEGIN
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='drive_connect' AND TABLE_NAME='bookings' AND COLUMN_NAME='hostPayoutAmount') THEN
    ALTER TABLE bookings ADD COLUMN hostPayoutAmount DECIMAL(10,2) NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='drive_connect' AND TABLE_NAME='bookings' AND COLUMN_NAME='platformFeeAmount') THEN
    ALTER TABLE bookings ADD COLUMN platformFeeAmount DECIMAL(10,2) NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='drive_connect' AND TABLE_NAME='bookings' AND COLUMN_NAME='payoutStatus') THEN
    ALTER TABLE bookings ADD COLUMN payoutStatus VARCHAR(50) NOT NULL DEFAULT 'pending'; -- 'pending', 'processing', 'paid'
  END IF;
END //
DELIMITER ;
CALL add_booking_payout_columns();
DROP PROCEDURE IF EXISTS add_booking_payout_columns;
