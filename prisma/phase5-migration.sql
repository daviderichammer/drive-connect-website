-- Phase 5 Migration: Renter Dashboard Additions
-- Run on drive_connect database

-- Create RenterAccounts table
CREATE TABLE IF NOT EXISTS renter_accounts (
  id INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  phone VARCHAR(50) NULL,
  profileImageUrl VARCHAR(500) NULL,
  licenseNumber VARCHAR(100) NULL,
  licenseState VARCHAR(50) NULL,
  licenseVerified TINYINT(1) NOT NULL DEFAULT 0,
  resetToken VARCHAR(255) NULL,
  resetTokenExpiry DATETIME(3) NULL,
  isActive TINYINT(1) NOT NULL DEFAULT 1,
  lastLoginAt DATETIME(3) NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uk_renter_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create RenterSessions table
CREATE TABLE IF NOT EXISTS renter_sessions (
  id INT NOT NULL AUTO_INCREMENT,
  renterId INT NOT NULL,
  sessionToken VARCHAR(255) NOT NULL,
  expiresAt DATETIME(3) NOT NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uk_renter_session_token (sessionToken),
  CONSTRAINT fk_renter_sessions_renter FOREIGN KEY (renterId) REFERENCES renter_accounts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id INT NOT NULL AUTO_INCREMENT,
  renterId INT NOT NULL,
  vehicleId INT NOT NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uk_favorites_renter_vehicle (renterId, vehicleId),
  CONSTRAINT fk_favorites_renter FOREIGN KEY (renterId) REFERENCES renter_accounts(id) ON DELETE CASCADE,
  CONSTRAINT fk_favorites_vehicle FOREIGN KEY (vehicleId) REFERENCES vehicles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id INT NOT NULL AUTO_INCREMENT,
  renterId INT NOT NULL,
  bookingId INT NOT NULL,
  vehicleId INT NOT NULL,
  rating TINYINT NOT NULL,
  text TEXT NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uk_reviews_booking (bookingId),
  CONSTRAINT fk_reviews_renter FOREIGN KEY (renterId) REFERENCES renter_accounts(id) ON DELETE CASCADE,
  CONSTRAINT fk_reviews_booking FOREIGN KEY (bookingId) REFERENCES bookings(id) ON DELETE CASCADE,
  CONSTRAINT fk_reviews_vehicle FOREIGN KEY (vehicleId) REFERENCES vehicles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add renterAccountId to bookings if it doesn't exist
DROP PROCEDURE IF EXISTS add_booking_renter_account_column;
DELIMITER //
CREATE PROCEDURE add_booking_renter_account_column()
BEGIN
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='drive_connect' AND TABLE_NAME='bookings' AND COLUMN_NAME='renterAccountId') THEN
    ALTER TABLE bookings ADD COLUMN renterAccountId INT NULL;
  END IF;
END //
DELIMITER ;
CALL add_booking_renter_account_column();
DROP PROCEDURE IF EXISTS add_booking_renter_account_column;
