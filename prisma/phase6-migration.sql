-- Phase 6 Migration: Add Stripe, Insurance, Dynamic Pricing, Identity Verification fields

-- 6A: Stripe payment fields on bookings
ALTER TABLE bookings 
  ADD COLUMN stripePaymentIntentId VARCHAR(255) NULL,
  ADD COLUMN stripeChargeId VARCHAR(255) NULL;

-- 6C: Insurance fields on bookings
ALTER TABLE bookings
  ADD COLUMN insuranceTier VARCHAR(50) NULL,
  ADD COLUMN insuranceAmount DECIMAL(10,2) NULL;

-- 6E: Dynamic pricing fields on bookings
ALTER TABLE bookings
  ADD COLUMN pricingMultiplier DECIMAL(5,4) NULL,
  ADD COLUMN earlyBirdDiscount DECIMAL(10,2) NULL,
  ADD COLUMN durationDiscount DECIMAL(10,2) NULL,
  ADD COLUMN priceBreakdown TEXT NULL;

-- 6B: Identity verification fields on renter_accounts
ALTER TABLE renter_accounts
  ADD COLUMN licenseImageFront VARCHAR(500) NULL,
  ADD COLUMN licenseImageBack VARCHAR(500) NULL,
  ADD COLUMN verificationStatus VARCHAR(50) NOT NULL DEFAULT 'unverified',
  ADD COLUMN verificationNotes TEXT NULL,
  ADD COLUMN verificationReviewedAt DATETIME NULL;

-- 6D: AI description flag on vehicles
ALTER TABLE vehicles
  ADD COLUMN aiDescriptionGenerated BOOLEAN NOT NULL DEFAULT false;
