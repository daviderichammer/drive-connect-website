-- Phase 3 Migration: Search & Booking Engine
-- Run on drive_connect database

-- Add new columns to vehicles table for search indexing
-- Using stored procedure to handle IF NOT EXISTS for older MySQL
DROP PROCEDURE IF EXISTS add_vehicle_columns;
DELIMITER //
CREATE PROCEDURE add_vehicle_columns()
BEGIN
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='drive_connect' AND TABLE_NAME='vehicles' AND COLUMN_NAME='category') THEN
    ALTER TABLE vehicles ADD COLUMN category VARCHAR(50) NOT NULL DEFAULT 'Sedan';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='drive_connect' AND TABLE_NAME='vehicles' AND COLUMN_NAME='city') THEN
    ALTER TABLE vehicles ADD COLUMN city VARCHAR(255) NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='drive_connect' AND TABLE_NAME='vehicles' AND COLUMN_NAME='zipCode') THEN
    ALTER TABLE vehicles ADD COLUMN zipCode VARCHAR(20) NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='drive_connect' AND TABLE_NAME='vehicles' AND COLUMN_NAME='rating') THEN
    ALTER TABLE vehicles ADD COLUMN rating DECIMAL(3,1) NOT NULL DEFAULT 0.0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='drive_connect' AND TABLE_NAME='vehicles' AND COLUMN_NAME='trips') THEN
    ALTER TABLE vehicles ADD COLUMN trips INT NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='drive_connect' AND TABLE_NAME='vehicles' AND COLUMN_NAME='unlimitedMiles') THEN
    ALTER TABLE vehicles ADD COLUMN unlimitedMiles TINYINT(1) NOT NULL DEFAULT 0;
  END IF;
END //
DELIMITER ;
CALL add_vehicle_columns();
DROP PROCEDURE IF EXISTS add_vehicle_columns;

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id INT NOT NULL AUTO_INCREMENT,
  bookingReference VARCHAR(50) NOT NULL,
  vehicleId INT NOT NULL,
  hostId INT NOT NULL,
  renterFirstName VARCHAR(100) NOT NULL,
  renterLastName VARCHAR(100) NOT NULL,
  renterEmail VARCHAR(255) NOT NULL,
  renterPhone VARCHAR(50) NOT NULL,
  renterLicenseNumber VARCHAR(100) NOT NULL,
  renterLicenseState VARCHAR(50) NOT NULL,
  startDate DATETIME(3) NOT NULL,
  endDate DATETIME(3) NOT NULL,
  pickupTime VARCHAR(20) NOT NULL DEFAULT '10:00',
  returnTime VARCHAR(20) NOT NULL DEFAULT '10:00',
  deliveryOption VARCHAR(50) NOT NULL DEFAULT 'pickup',
  deliveryAddress VARCHAR(255) NULL,
  protectionPlan VARCHAR(50) NOT NULL DEFAULT 'basic',
  basePrice DECIMAL(10,2) NOT NULL,
  protectionPrice DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  deliveryPrice DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  taxes DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  totalPrice DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  paymentStatus VARCHAR(50) NOT NULL DEFAULT 'pending',
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uk_booking_ref (bookingReference),
  INDEX idx_bookings_vehicle (vehicleId),
  INDEX idx_bookings_host (hostId),
  INDEX idx_bookings_renter_email (renterEmail),
  CONSTRAINT fk_bookings_vehicle FOREIGN KEY (vehicleId) REFERENCES vehicles(id),
  CONSTRAINT fk_bookings_host FOREIGN KEY (hostId) REFERENCES host_accounts(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed demo host account (for demo vehicles)
INSERT IGNORE INTO partner_applications (
  businessName, ownerName, email, phone, primaryCity,
  numberOfVehicles, vehicleTypes, currentPlatforms,
  offersAirportDelivery, offersHomeDelivery, hasCommercialInsurance,
  status, createdAt, updatedAt
) VALUES (
  'Premier Auto Group', 'Michael Torres', 'demo@premierauto.com', '813-555-0100', 'Tampa',
  15, 'SUV,Luxury,Sedan', 'Turo',
  1, 1, 1,
  'approved', NOW(), NOW()
);

SET @app_id = LAST_INSERT_ID();

INSERT IGNORE INTO host_accounts (
  applicationId, email, passwordHash, businessName, ownerName, phone,
  description, serviceAreas, profileCompleted, onboardingCompleted,
  insuranceVerified, bankingInfoCompleted, isActive, createdAt, updatedAt
) VALUES (
  @app_id, 'demo@premierauto.com',
  '$2b$10$placeholder_hash_not_for_login',
  'Premier Auto Group', 'Michael Torres', '813-555-0100',
  'Tampa Bay''s premier luxury vehicle rental operator. 15+ vehicles, airport delivery available.',
  'Tampa,Orlando,Miami',
  1, 1, 1, 1, 1, NOW(), NOW()
);

SET @host_id = LAST_INSERT_ID();

-- Seed demo vehicles
INSERT INTO vehicles (
  hostId, year, make, model, trim, color, seats, fuelType, transmission,
  dailyRate, weeklyRate, monthlyRate, securityDeposit, mileageIncluded,
  hasGPS, hasBluetooth, hasCarPlay, offersAirportPickup, offersHomeDelivery,
  deliveryFee, description, status, photos, category, city, zipCode,
  rating, trips, unlimitedMiles, createdAt, updatedAt
) VALUES
(
  @host_id, 2024, 'BMW', 'X5', 'xDrive40i', 'Black', 5, 'Gasoline', 'Automatic',
  189.00, 1199.00, 3999.00, 500.00, 200,
  1, 1, 1, 1, 1,
  35.00, 'Premium luxury SUV with all the amenities. Perfect for business travel or family trips.',
  'active',
  '["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80","https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80"]',
  'Luxury SUV', 'Tampa', '33602',
  4.9, 142, 0, NOW(), NOW()
),
(
  @host_id, 2024, 'Mercedes-Benz', 'C-Class', 'C300', 'Silver', 5, 'Gasoline', 'Automatic',
  149.00, 949.00, 3199.00, 400.00, 150,
  1, 1, 1, 1, 1,
  35.00, 'Elegant luxury sedan with cutting-edge technology and superior comfort.',
  'active',
  '["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80","https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80"]',
  'Luxury Sedan', 'Tampa', '33602',
  4.8, 98, 0, NOW(), NOW()
),
(
  @host_id, 2024, 'Tesla', 'Model 3', 'Long Range', 'White', 5, 'Electric', 'Automatic',
  129.00, 849.00, 2799.00, 350.00, 300,
  1, 1, 1, 0, 1,
  25.00, 'All-electric luxury sedan with autopilot. Zero emissions, maximum performance.',
  'active',
  '["https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80","https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80"]',
  'Electric', 'Tampa', '33602',
  4.9, 211, 1, NOW(), NOW()
),
(
  @host_id, 2024, 'Porsche', 'Cayenne', 'S', 'Midnight Blue', 5, 'Gasoline', 'Automatic',
  249.00, 1599.00, 5299.00, 750.00, 150,
  1, 1, 1, 1, 1,
  50.00, 'The ultimate luxury performance SUV. Porsche engineering meets everyday practicality.',
  'active',
  '["https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80","https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80"]',
  'Luxury SUV', 'Tampa', '33602',
  5.0, 67, 0, NOW(), NOW()
),
(
  @host_id, 2024, 'Range Rover', 'Sport', 'HSE', 'Santorini Black', 5, 'Gasoline', 'Automatic',
  219.00, 1399.00, 4599.00, 600.00, 200,
  1, 1, 1, 1, 1,
  40.00, 'Iconic British luxury SUV. Commanding presence on any road.',
  'active',
  '["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80","https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80"]',
  'Luxury SUV', 'Tampa', '33602',
  4.7, 54, 1, NOW(), NOW()
),
(
  @host_id, 2024, 'Cadillac', 'Escalade', 'Premium Luxury', 'Black Raven', 7, 'Gasoline', 'Automatic',
  199.00, 1299.00, 4299.00, 550.00, 150,
  1, 1, 1, 0, 0,
  0.00, 'America''s premier full-size luxury SUV. Perfect for groups and VIP transportation.',
  'active',
  '["https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80","https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80"]',
  'Full-Size SUV', 'Orlando', '32801',
  4.8, 89, 0, NOW(), NOW()
),
(
  @host_id, 2024, 'Ferrari', '488 GTB', 'Spider', 'Rosso Corsa', 2, 'Gasoline', 'Automatic',
  899.00, 5499.00, 17999.00, 2500.00, 100,
  0, 1, 0, 1, 0,
  75.00, 'Experience the pinnacle of Italian automotive engineering. The Ferrari 488 Spider.',
  'active',
  '["https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80","https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80"]',
  'Sports', 'Miami', '33101',
  5.0, 23, 0, NOW(), NOW()
),
(
  @host_id, 2024, 'Lamborghini', 'Urus', 'S', 'Arancio Borealis', 5, 'Gasoline', 'Automatic',
  699.00, 4299.00, 13999.00, 2000.00, 100,
  1, 1, 1, 1, 0,
  75.00, 'The world''s first Super Sport Utility Vehicle. Lamborghini DNA in an SUV.',
  'active',
  '["https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80","https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80"]',
  'Luxury SUV', 'Miami', '33101',
  4.9, 31, 0, NOW(), NOW()
),
(
  @host_id, 2024, 'Toyota', 'Camry', 'XSE', 'Midnight Black', 5, 'Gasoline', 'Automatic',
  79.00, 499.00, 1699.00, 200.00, 250,
  1, 1, 1, 0, 1,
  20.00, 'Reliable, comfortable, and fuel-efficient. The perfect everyday rental.',
  'active',
  '["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80","https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80"]',
  'Sedan', 'Orlando', '32801',
  4.6, 178, 1, NOW(), NOW()
),
(
  @host_id, 2024, 'Ford', 'Mustang', 'GT Premium', 'Race Red', 4, 'Gasoline', 'Manual',
  159.00, 999.00, 3299.00, 450.00, 150,
  0, 1, 1, 1, 0,
  35.00, 'American muscle at its finest. The iconic Ford Mustang GT with a 5.0L V8.',
  'active',
  '["https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=800&q=80","https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=800&q=80"]',
  'Sports', 'Tampa', '33602',
  4.7, 56, 0, NOW(), NOW()
),
(
  @host_id, 2024, 'Tesla', 'Model Y', 'Performance', 'Pearl White', 5, 'Electric', 'Automatic',
  139.00, 899.00, 2999.00, 400.00, 350,
  1, 1, 1, 1, 1,
  30.00, 'The best-selling electric SUV. Autopilot, panoramic roof, and incredible range.',
  'active',
  '["https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80","https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80"]',
  'Electric', 'Orlando', '32801',
  4.8, 134, 1, NOW(), NOW()
),
(
  @host_id, 2024, 'Chevrolet', 'Suburban', 'LTZ', 'Summit White', 8, 'Gasoline', 'Automatic',
  179.00, 1149.00, 3799.00, 500.00, 200,
  1, 1, 1, 1, 1,
  40.00, 'Maximum space, maximum comfort. Perfect for large groups and family road trips.',
  'active',
  '["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80","https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80"]',
  'Full-Size SUV', 'Miami', '33101',
  4.5, 67, 0, NOW(), NOW()
);
