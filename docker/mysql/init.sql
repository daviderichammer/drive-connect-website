-- Drive Connect Database Initialization
-- This script runs on first MySQL container startup

CREATE DATABASE IF NOT EXISTS drive_connect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'drive_connect_user'@'%' IDENTIFIED BY 'DriveConnect2024!';

GRANT ALL PRIVILEGES ON drive_connect.* TO 'drive_connect_user'@'%';

FLUSH PRIVILEGES;

USE drive_connect;

-- Partner Applications Table
CREATE TABLE IF NOT EXISTS partner_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  businessName VARCHAR(255) NOT NULL,
  ownerName VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  primaryCity VARCHAR(255) NOT NULL,
  additionalCities TEXT,
  numberOfVehicles INT DEFAULT 0,
  vehicleTypes TEXT,
  currentPlatforms TEXT,
  turoProfileUrl VARCHAR(500),
  offersAirportDelivery TINYINT(1) DEFAULT 0,
  offersHomeDelivery TINYINT(1) DEFAULT 0,
  hasCommercialInsurance TINYINT(1) DEFAULT 0,
  supportsSameDayBookings TINYINT(1) DEFAULT 0,
  operates24x7 TINYINT(1) DEFAULT 0,
  wouldUseDCSupport TINYINT(1) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contact Submissions Table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
