'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Vehicle {
  id: number;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  color: string | null;
  category: string;
  seats: number;
  fuelType: string;
  transmission: string;
  mileage: number | null;
  mileageIncluded: number | null;
  dailyRate: number;
  weeklyRate: number | null;
  monthlyRate: number | null;
  securityDeposit: number | null;
  deliveryFee: number | null;
  hasGPS: boolean;
  hasBluetooth: boolean;
  hasCarPlay: boolean;
  hasChargingCable: boolean;
  hasChildSeat: boolean;
  offersAirportPickup: boolean;
  offersHomeDelivery: boolean;
  unlimitedMiles: boolean;
  description: string | null;
  vehicleRules: string | null;
  pickupInstructions: string | null;
  photos: string[];
  rating: number;
  trips: number;
  city: string | null;
  zipCode: string | null;
  host: {
    id: number;
    businessName: string;
    ownerName: string;
    description: string | null;
    logoUrl: string | null;
    serviceAreas: string | null;
    insuranceVerified: boolean;
  };
  bookings: Array<{ startDate: string; endDate: string }>;
}

const PROTECTION_PLANS = [
  {
    id: 'none',
    name: 'No Protection',
    price: 0,
    description: 'You are responsible for all damages. Not recommended.',
    color: '#888888',
  },
  {
    id: 'basic',
    name: 'Basic Protection',
    price: 15,
    description: '$2,500 deductible. Covers most common damage scenarios.',
    color: '#333333',
    recommended: false,
  },
  {
    id: 'standard',
    name: 'Standard Protection',
    price: 29,
    description: '$1,000 deductible. Comprehensive coverage for peace of mind.',
    color: '#000000',
    recommended: true,
  },
  {
    id: 'premium',
    name: 'Premium Protection',
    price: 49,
    description: '$0 deductible. Full coverage, zero out-of-pocket risk.',
    color: '#DC2626',
  },
];

export default function VehicleDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const vehicleId = params.id as string;

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activePhoto, setActivePhoto] = useState(0);
  const [selectedProtection, setSelectedProtection] = useState('standard');

  // Booking form state
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');
  const [pickupTime, setPickupTime] = useState('10:00');
  const [returnTime, setReturnTime] = useState('10:00');
  const [deliveryOption, setDeliveryOption] = useState('pickup');

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await fetch(`/api/vehicles/${vehicleId}`);
        const data = await res.json();
        if (data.success) {
          setVehicle(data.vehicle);
        } else {
          setError('Vehicle not found');
        }
      } catch {
        setError('Failed to load vehicle');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [vehicleId]);

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.max(0, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  };

  const calculatePricing = () => {
    if (!vehicle) return { base: 0, protection: 0, delivery: 0, taxes: 0, total: 0 };
    const days = calculateDays();
    if (days === 0) return { base: 0, protection: 0, delivery: 0, taxes: 0, total: 0 };

    let base: number;
    if (days >= 28 && vehicle.monthlyRate) {
      const months = Math.floor(days / 28);
      const remaining = days % 28;
      base = months * vehicle.monthlyRate + remaining * vehicle.dailyRate;
    } else if (days >= 7 && vehicle.weeklyRate) {
      const weeks = Math.floor(days / 7);
      const remaining = days % 7;
      base = weeks * vehicle.weeklyRate + remaining * vehicle.dailyRate;
    } else {
      base = days * vehicle.dailyRate;
    }

    const protectionPlan = PROTECTION_PLANS.find(p => p.id === selectedProtection);
    const protection = (protectionPlan?.price || 0) * days;
    const delivery = deliveryOption !== 'pickup' && vehicle.deliveryFee ? vehicle.deliveryFee : 0;
    const subtotal = base + protection + delivery;
    const taxes = parseFloat((subtotal * 0.07).toFixed(2));
    const total = parseFloat((subtotal + taxes).toFixed(2));

    return { base, protection, delivery, taxes, total, days };
  };

  const handleBookNow = () => {
    if (!startDate || !endDate) {
      document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const pricing = calculatePricing();
    const queryParams = new URLSearchParams({
      vehicleId: vehicleId,
      startDate,
      endDate,
      pickupTime,
      returnTime,
      deliveryOption,
      protectionPlan: selectedProtection,
      totalPrice: pricing.total.toString(),
      days: (pricing.days || 0).toString(),
    });
    router.push(`/booking/checkout?${queryParams.toString()}`);
  };

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - (half ? 1 : 0));
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #e5e7eb', borderTopColor: '#DC2626', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: '#666666' }}>Loading vehicle details...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>Vehicle not found</p>
        <Link href="/find-a-car" style={{ color: '#DC2626', textDecoration: 'none', fontWeight: 600 }}>← Back to Search</Link>
      </div>
    );
  }

  const pricing = calculatePricing();
  const days = calculateDays();

  return (
    <>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: '#000000', padding: '1rem 1.5rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <p style={{ color: '#aaaaaa', fontSize: '0.875rem' }}>
            <Link href="/find-a-car" style={{ color: '#aaaaaa', textDecoration: 'none' }}>Find A Car</Link>
            {' '}&rsaquo;{' '}
            <span style={{ color: '#ffffff' }}>{vehicle.year} {vehicle.make} {vehicle.model}</span>
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>

          {/* LEFT COLUMN */}
          <div>
            {/* Vehicle title */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#000000', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
                {vehicle.year} {vehicle.make} {vehicle.model}
                {vehicle.trim ? ` ${vehicle.trim}` : ''}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.875rem', color: '#666666', backgroundColor: '#F5F5F5', padding: '0.25rem 0.75rem', borderRadius: '20px' }}>
                  {vehicle.category}
                </span>
                <span style={{ color: '#f59e0b', fontSize: '1rem' }}>{renderStars(vehicle.rating)}</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{vehicle.rating.toFixed(1)}</span>
                <span style={{ fontSize: '0.875rem', color: '#888888' }}>({vehicle.trips} trips)</span>
                {vehicle.city && <span style={{ fontSize: '0.875rem', color: '#888888' }}>📍 {vehicle.city}</span>}
              </div>
            </div>

            {/* Photo Gallery */}
            <div style={{ marginBottom: '2rem' }}>
              {/* Main photo */}
              <div style={{ borderRadius: '12px', overflow: 'hidden', height: '420px', backgroundColor: '#e5e7eb', marginBottom: '0.75rem' }}>
                {vehicle.photos && vehicle.photos.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={vehicle.photos[activePhoto]}
                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '5rem' }}>🚗</span>
                  </div>
                )}
              </div>
              {/* Thumbnails */}
              {vehicle.photos && vehicle.photos.length > 1 && (
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
                  {vehicle.photos.map((photo, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhoto(idx)}
                      style={{
                        width: '80px', height: '60px', borderRadius: '6px', overflow: 'hidden', border: activePhoto === idx ? '2px solid #DC2626' : '2px solid transparent', cursor: 'pointer', padding: 0, flexShrink: 0
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Badges */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {vehicle.unlimitedMiles && (
                <span style={{ backgroundColor: '#000000', color: '#ffffff', fontSize: '0.75rem', fontWeight: 700, padding: '0.375rem 0.75rem', borderRadius: '4px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Unlimited Miles
                </span>
              )}
              {vehicle.offersAirportPickup && (
                <span style={{ backgroundColor: '#DC2626', color: '#ffffff', fontSize: '0.75rem', fontWeight: 700, padding: '0.375rem 0.75rem', borderRadius: '4px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  ✈ Airport Delivery
                </span>
              )}
              {vehicle.offersHomeDelivery && (
                <span style={{ backgroundColor: '#333333', color: '#ffffff', fontSize: '0.75rem', fontWeight: 700, padding: '0.375rem 0.75rem', borderRadius: '4px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  🏠 Home Delivery
                </span>
              )}
            </div>

            {/* Vehicle Specs */}
            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#000000', letterSpacing: '-0.01em', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #000000' }}>
                Vehicle Specifications
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {[
                  { label: 'Year', value: vehicle.year.toString() },
                  { label: 'Make', value: vehicle.make },
                  { label: 'Model', value: vehicle.model },
                  { label: 'Trim', value: vehicle.trim || 'Standard' },
                  { label: 'Color', value: vehicle.color || 'N/A' },
                  { label: 'Seats', value: `${vehicle.seats} passengers` },
                  { label: 'Fuel Type', value: vehicle.fuelType },
                  { label: 'Transmission', value: vehicle.transmission },
                  { label: 'Mileage Included', value: vehicle.unlimitedMiles ? 'Unlimited' : vehicle.mileageIncluded ? `${vehicle.mileageIncluded}/day` : 'N/A' },
                ].map(spec => (
                  <div key={spec.label} style={{ backgroundColor: '#F5F5F5', borderRadius: '8px', padding: '0.875rem' }}>
                    <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#888888', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{spec.label}</p>
                    <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#000000' }}>{spec.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Features */}
            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#000000', letterSpacing: '-0.01em', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #000000' }}>
                Features & Amenities
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                {[
                  { label: 'GPS Navigation', available: vehicle.hasGPS, icon: '🗺️' },
                  { label: 'Bluetooth', available: vehicle.hasBluetooth, icon: '📶' },
                  { label: 'Apple CarPlay', available: vehicle.hasCarPlay, icon: '📱' },
                  { label: 'Charging Cable', available: vehicle.hasChargingCable, icon: '🔌' },
                  { label: 'Child Seat Available', available: vehicle.hasChildSeat, icon: '👶' },
                  { label: 'Airport Pickup', available: vehicle.offersAirportPickup, icon: '✈️' },
                  { label: 'Home Delivery', available: vehicle.offersHomeDelivery, icon: '🏠' },
                  { label: 'Unlimited Miles', available: vehicle.unlimitedMiles, icon: '∞' },
                ].map(feat => (
                  <div key={feat.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', backgroundColor: feat.available ? '#f0fdf4' : '#F5F5F5', borderRadius: '8px', border: feat.available ? '1px solid #bbf7d0' : '1px solid #e5e7eb' }}>
                    <span style={{ fontSize: '1.25rem' }}>{feat.icon}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: feat.available ? '#166534' : '#888888' }}>
                      {feat.label}
                    </span>
                    <span style={{ marginLeft: 'auto', fontSize: '1rem' }}>{feat.available ? '✓' : '✗'}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Description */}
            {vehicle.description && (
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#000000', letterSpacing: '-0.01em', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #000000' }}>
                  About This Vehicle
                </h2>
                <p style={{ fontSize: '0.9375rem', color: '#333333', lineHeight: 1.7 }}>{vehicle.description}</p>
              </section>
            )}

            {/* Pricing Breakdown */}
            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#000000', letterSpacing: '-0.01em', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #000000' }}>
                Pricing
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ backgroundColor: '#F5F5F5', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#888888', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Daily Rate</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#DC2626' }}>${vehicle.dailyRate}</p>
                </div>
                {vehicle.weeklyRate && (
                  <div style={{ backgroundColor: '#F5F5F5', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#888888', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Weekly Rate</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#000000' }}>${vehicle.weeklyRate}</p>
                  </div>
                )}
                {vehicle.monthlyRate && (
                  <div style={{ backgroundColor: '#F5F5F5', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#888888', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Monthly Rate</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#000000' }}>${vehicle.monthlyRate}</p>
                  </div>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                {vehicle.securityDeposit && (
                  <div style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '8px', padding: '0.875rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c2410c', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Security Deposit</p>
                    <p style={{ fontSize: '1rem', fontWeight: 700, color: '#000000' }}>${vehicle.securityDeposit}</p>
                    <p style={{ fontSize: '0.75rem', color: '#888888' }}>Refunded after return</p>
                  </div>
                )}
                {vehicle.deliveryFee && vehicle.deliveryFee > 0 && (
                  <div style={{ backgroundColor: '#F5F5F5', borderRadius: '8px', padding: '0.875rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#888888', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Delivery Fee</p>
                    <p style={{ fontSize: '1rem', fontWeight: 700, color: '#000000' }}>${vehicle.deliveryFee}</p>
                    <p style={{ fontSize: '0.75rem', color: '#888888' }}>Per trip</p>
                  </div>
                )}
              </div>
            </section>

            {/* Host Profile */}
            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#000000', letterSpacing: '-0.01em', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #000000' }}>
                Your Host
              </h2>
              <div style={{ backgroundColor: '#F5F5F5', borderRadius: '12px', padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: 900 }}>
                    {vehicle.host.businessName.charAt(0)}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#000000' }}>{vehicle.host.businessName}</h3>
                    {vehicle.host.insuranceVerified && (
                      <span style={{ backgroundColor: '#dcfce7', color: '#166534', fontSize: '0.6875rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#666666', marginBottom: '0.5rem' }}>Operated by {vehicle.host.ownerName}</p>
                  {vehicle.host.description && (
                    <p style={{ fontSize: '0.875rem', color: '#333333', lineHeight: 1.6 }}>{vehicle.host.description}</p>
                  )}
                  {vehicle.host.serviceAreas && (
                    <p style={{ fontSize: '0.8125rem', color: '#888888', marginTop: '0.5rem' }}>
                      📍 Serving: {vehicle.host.serviceAreas}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Protection Plans */}
            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#000000', letterSpacing: '-0.01em', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #000000' }}>
                Protection Plans
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {PROTECTION_PLANS.map(plan => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedProtection(plan.id)}
                    style={{
                      border: selectedProtection === plan.id ? '2px solid #DC2626' : '2px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '1rem 1.25rem',
                      cursor: 'pointer',
                      backgroundColor: selectedProtection === plan.id ? '#fff5f5' : '#ffffff',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: selectedProtection === plan.id ? '6px solid #DC2626' : '2px solid #d1d5db', backgroundColor: selectedProtection === plan.id ? '#DC2626' : 'transparent', flexShrink: 0 }} />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#000000' }}>{plan.name}</p>
                          {plan.recommended && (
                            <span style={{ backgroundColor: '#DC2626', color: '#ffffff', fontSize: '0.625rem', fontWeight: 700, padding: '0.125rem 0.375rem', borderRadius: '3px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Recommended</span>
                          )}
                        </div>
                        <p style={{ fontSize: '0.8125rem', color: '#666666' }}>{plan.description}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ fontSize: '1rem', fontWeight: 800, color: plan.price === 0 ? '#888888' : '#000000' }}>
                        {plan.price === 0 ? 'Free' : `+$${plan.price}/day`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Rules */}
            {vehicle.vehicleRules && (
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#000000', letterSpacing: '-0.01em', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #000000' }}>
                  Vehicle Rules
                </h2>
                <p style={{ fontSize: '0.9375rem', color: '#333333', lineHeight: 1.7 }}>{vehicle.vehicleRules}</p>
              </section>
            )}
          </div>

          {/* RIGHT COLUMN — Booking Widget */}
          <div id="book" style={{ position: 'sticky', top: '80px' }}>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
              {/* Price header */}
              <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 900, color: '#DC2626' }}>${vehicle.dailyRate}</span>
                  <span style={{ fontSize: '0.875rem', color: '#888888' }}>/ day</span>
                </div>
                {vehicle.weeklyRate && (
                  <p style={{ fontSize: '0.8125rem', color: '#666666', marginTop: '0.25rem' }}>
                    ${vehicle.weeklyRate}/week · ${vehicle.monthlyRate}/month
                  </p>
                )}
              </div>

              {/* Date pickers */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#333333', marginBottom: '0.25rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Pickup</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      style={{ width: '100%', padding: '0.625rem', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.8125rem', backgroundColor: '#F5F5F5', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#333333', marginBottom: '0.25rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Return</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                      min={startDate || new Date().toISOString().split('T')[0]}
                      style={{ width: '100%', padding: '0.625rem', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.8125rem', backgroundColor: '#F5F5F5', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#333333', marginBottom: '0.25rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Pickup Time</label>
                    <select value={pickupTime} onChange={e => setPickupTime(e.target.value)} style={{ width: '100%', padding: '0.625rem', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.8125rem', backgroundColor: '#F5F5F5', fontFamily: 'Inter, sans-serif', outline: 'none' }}>
                      {['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#333333', marginBottom: '0.25rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Return Time</label>
                    <select value={returnTime} onChange={e => setReturnTime(e.target.value)} style={{ width: '100%', padding: '0.625rem', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.8125rem', backgroundColor: '#F5F5F5', fontFamily: 'Inter, sans-serif', outline: 'none' }}>
                      {['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Delivery option */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#333333', marginBottom: '0.375rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Pickup / Delivery</label>
                <select value={deliveryOption} onChange={e => setDeliveryOption(e.target.value)} style={{ width: '100%', padding: '0.625rem', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.8125rem', backgroundColor: '#F5F5F5', fontFamily: 'Inter, sans-serif', outline: 'none' }}>
                  <option value="pickup">Self Pickup</option>
                  {vehicle.offersAirportPickup && <option value="airport">Airport Delivery (+${vehicle.deliveryFee})</option>}
                  {vehicle.offersHomeDelivery && <option value="home">Home Delivery (+${vehicle.deliveryFee})</option>}
                </select>
              </div>

              {/* Protection plan selector */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#333333', marginBottom: '0.375rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Protection Plan</label>
                <select value={selectedProtection} onChange={e => setSelectedProtection(e.target.value)} style={{ width: '100%', padding: '0.625rem', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.8125rem', backgroundColor: '#F5F5F5', fontFamily: 'Inter, sans-serif', outline: 'none' }}>
                  {PROTECTION_PLANS.map(p => (
                    <option key={p.id} value={p.id}>{p.name} {p.price > 0 ? `(+$${p.price}/day)` : '(Free)'}</option>
                  ))}
                </select>
              </div>

              {/* Price breakdown */}
              {days > 0 && (
                <div style={{ backgroundColor: '#F5F5F5', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#555555' }}>${vehicle.dailyRate} × {days} days</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>${pricing.base.toFixed(2)}</span>
                  </div>
                  {pricing.protection > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                      <span style={{ fontSize: '0.875rem', color: '#555555' }}>Protection plan</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>${pricing.protection.toFixed(2)}</span>
                    </div>
                  )}
                  {pricing.delivery > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                      <span style={{ fontSize: '0.875rem', color: '#555555' }}>Delivery fee</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>${pricing.delivery.toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#555555' }}>Taxes (7%)</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>${pricing.taxes.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb', marginTop: '0.375rem' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: '#000000' }}>Total</span>
                    <span style={{ fontSize: '1rem', fontWeight: 900, color: '#DC2626' }}>${pricing.total.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Book Now button */}
              <button
                onClick={handleBookNow}
                style={{ width: '100%', backgroundColor: '#DC2626', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '1rem', fontWeight: 800, fontSize: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Inter, sans-serif', marginBottom: '0.75rem' }}
              >
                {days > 0 ? `Book Now — $${pricing.total.toFixed(2)}` : 'Select Dates to Book'}
              </button>

              <p style={{ fontSize: '0.75rem', color: '#888888', textAlign: 'center', lineHeight: 1.5 }}>
                No charges until confirmed. Free cancellation within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
