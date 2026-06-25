'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Vehicle {
  id: number;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  category: string;
  dailyRate: number;
  photos: string[];
  rating: number;
  trips: number;
  city: string | null;
  securityDeposit: number | null;
  host: {
    businessName: string;
    ownerName: string;
  };
}

const PROTECTION_PLANS: Record<string, { name: string; price: number; description: string; deductible: string }> = {
  none: { name: 'No Protection', price: 0, description: 'You are responsible for all damages.', deductible: 'Full cost' },
  basic: { name: 'Basic Protection', price: 15, description: 'Covers most common damage scenarios.', deductible: '$2,500' },
  standard: { name: 'Standard Protection', price: 29, description: 'Comprehensive coverage for peace of mind.', deductible: '$1,000' },
  premium: { name: 'Premium Protection', price: 49, description: 'Full coverage, zero out-of-pocket risk.', deductible: '$0' },
};

const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'];

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const vehicleId = searchParams.get('vehicleId') || '';
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';
  const pickupTime = searchParams.get('pickupTime') || '10:00';
  const returnTime = searchParams.get('returnTime') || '10:00';
  const deliveryOption = searchParams.get('deliveryOption') || 'pickup';
  const protectionPlan = searchParams.get('protectionPlan') || 'standard';
  const totalPrice = parseFloat(searchParams.get('totalPrice') || '0');
  const days = parseInt(searchParams.get('days') || '0');

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Renter form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseState, setLicenseState] = useState('FL');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeAge, setAgreeAge] = useState(false);

  // Payment form state (UI only)
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  useEffect(() => {
    if (!vehicleId) return;
    const fetchVehicle = async () => {
      try {
        const res = await fetch(`/api/vehicles/${vehicleId}`);
        const data = await res.json();
        if (data.success) setVehicle(data.vehicle);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [vehicleId]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const plan = PROTECTION_PLANS[protectionPlan] || PROTECTION_PLANS.standard;
  const basePrice = vehicle ? days * vehicle.dailyRate : 0;
  const protectionPrice = plan.price * days;
  const taxes = parseFloat(((basePrice + protectionPrice) * 0.07).toFixed(2));

  const validateStep1 = () => {
    return firstName.trim() && lastName.trim() && email.trim() && phone.trim() &&
           licenseNumber.trim() && licenseState && agreeTerms && agreeAge;
  };

  const handleSubmitBooking = async () => {
    if (!validateStep1()) {
      setSubmitError('Please complete all required fields and agree to the terms.');
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: parseInt(vehicleId),
          startDate,
          endDate,
          pickupTime,
          returnTime,
          deliveryOption,
          protectionPlan,
          renterFirstName: firstName,
          renterLastName: lastName,
          renterEmail: email,
          renterPhone: phone,
          renterLicenseNumber: licenseNumber,
          renterLicenseState: licenseState,
        }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/booking/confirmation/${data.booking.bookingReference}`);
      } else {
        setSubmitError(data.error || 'Failed to create booking. Please try again.');
      }
    } catch {
      setSubmitError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '0.9375rem',
    backgroundColor: '#F5F5F5',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    boxSizing: 'border-box' as const,
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#333333',
    marginBottom: '0.375rem',
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #e5e7eb', borderTopColor: '#DC2626', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>Unable to load booking details</p>
        <Link href="/find-a-car" style={{ color: '#DC2626', textDecoration: 'none', fontWeight: 600 }}>← Back to Search</Link>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <section style={{ backgroundColor: '#000000', padding: '2rem 1.5rem', color: '#ffffff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ color: '#aaaaaa', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            <Link href="/find-a-car" style={{ color: '#aaaaaa', textDecoration: 'none' }}>Find A Car</Link>
            {' '}&rsaquo;{' '}
            <Link href={`/vehicles/${vehicleId}`} style={{ color: '#aaaaaa', textDecoration: 'none' }}>
              {vehicle.year} {vehicle.make} {vehicle.model}
            </Link>
            {' '}&rsaquo;{' '}
            <span style={{ color: '#ffffff' }}>Checkout</span>
          </p>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Complete Your Booking</h1>
        </div>
      </section>

      {/* Progress Steps */}
      <div style={{ backgroundColor: '#F5F5F5', borderBottom: '1px solid #e5e7eb', padding: '1rem 1.5rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '0', alignItems: 'center' }}>
          {[
            { num: 1, label: 'Renter Info' },
            { num: 2, label: 'Protection' },
            { num: 3, label: 'Payment' },
          ].map((s, idx) => (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center', flex: idx < 2 ? 1 : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: step >= s.num ? '#DC2626' : '#e5e7eb',
                  color: step >= s.num ? '#ffffff' : '#888888',
                  fontSize: '0.875rem', fontWeight: 700, flexShrink: 0,
                }}>
                  {step > s.num ? '✓' : s.num}
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: step === s.num ? 700 : 500, color: step >= s.num ? '#000000' : '#888888', whiteSpace: 'nowrap' }}>
                  {s.label}
                </span>
              </div>
              {idx < 2 && <div style={{ flex: 1, height: '2px', backgroundColor: step > s.num ? '#DC2626' : '#e5e7eb', margin: '0 1rem' }} />}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>

          {/* LEFT — Form */}
          <div>
            {/* STEP 1: Renter Information */}
            {step === 1 && (
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#000000', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '2px solid #000000' }}>
                  Step 1: Renter Information
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={labelStyle}>First Name *</label>
                    <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="John" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Last Name *</label>
                    <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Smith" style={inputStyle} />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={labelStyle}>Email Address *</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" style={inputStyle} />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={labelStyle}>Phone Number *</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(813) 555-0100" style={inputStyle} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={labelStyle}>Driver&apos;s License Number *</label>
                    <input type="text" value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} placeholder="D123-456-78-901-0" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>License State *</label>
                    <select value={licenseState} onChange={e => setLicenseState(e.target.value)} style={inputStyle}>
                      {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                {/* Agreements */}
                <div style={{ backgroundColor: '#F5F5F5', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#000000', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Required Agreements
                  </h3>
                  <label style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', cursor: 'pointer', alignItems: 'flex-start' }}>
                    <input type="checkbox" checked={agreeAge} onChange={e => setAgreeAge(e.target.checked)} style={{ accentColor: '#DC2626', width: '16px', height: '16px', marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.875rem', color: '#333333', lineHeight: 1.5 }}>
                      I confirm I am at least 21 years of age and hold a valid driver&apos;s license.
                    </span>
                  </label>
                  <label style={{ display: 'flex', gap: '0.75rem', cursor: 'pointer', alignItems: 'flex-start' }}>
                    <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} style={{ accentColor: '#DC2626', width: '16px', height: '16px', marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.875rem', color: '#333333', lineHeight: 1.5 }}>
                      I agree to the Drive Connect <Link href="/protection-plans" style={{ color: '#DC2626', textDecoration: 'none', fontWeight: 600 }}>Rental Terms & Conditions</Link> and understand the protection plan terms.
                    </span>
                  </label>
                </div>

                {submitError && step === 1 && (
                  <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.875rem', marginBottom: '1rem', color: '#dc2626', fontSize: '0.875rem' }}>
                    {submitError}
                  </div>
                )}

                <button
                  onClick={() => { if (validateStep1()) { setStep(2); setSubmitError(''); } else { setSubmitError('Please complete all required fields.'); } }}
                  style={{ width: '100%', backgroundColor: '#DC2626', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '1rem', fontWeight: 800, fontSize: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                >
                  Continue to Protection Plan →
                </button>
              </div>
            )}

            {/* STEP 2: Protection Plan */}
            {step === 2 && (
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#000000', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '2px solid #000000' }}>
                  Step 2: Protection Plan
                </h2>

                <p style={{ fontSize: '0.9375rem', color: '#555555', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  Your selected protection plan: <strong style={{ color: '#000000' }}>{plan.name}</strong> — {plan.description}
                  {plan.price > 0 && ` $${plan.price}/day × ${days} days = $${protectionPrice.toFixed(2)}`}
                </p>

                <div style={{ backgroundColor: '#F5F5F5', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#000000', marginBottom: '1rem' }}>How Drive Connect Protection Works</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                    {[
                      { icon: '🛡️', title: 'Pre-Trip Inspection', desc: 'Document the vehicle condition with photos before pickup.' },
                      { icon: '📋', title: 'Rental Agreement', desc: 'A digital rental agreement is generated for your trip.' },
                      { icon: '💰', title: 'Security Deposit', desc: `A $${vehicle.securityDeposit || 500} security deposit is held and released after return.` },
                      { icon: '📞', title: '24/7 Support', desc: 'Our team is available around the clock for any issues.' },
                    ].map(item => (
                      <div key={item.title} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{item.icon}</span>
                        <div>
                          <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#000000', marginBottom: '0.125rem' }}>{item.title}</p>
                          <p style={{ fontSize: '0.875rem', color: '#555555' }}>{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: '0.875rem', color: '#92400e', lineHeight: 1.6 }}>
                    <strong>Your Deductible:</strong> {plan.deductible} — {plan.description}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => setStep(1)}
                    style={{ flex: 1, backgroundColor: '#ffffff', color: '#000000', border: '2px solid #000000', borderRadius: '8px', padding: '1rem', fontWeight: 700, fontSize: '0.9375rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    style={{ flex: 2, backgroundColor: '#DC2626', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '1rem', fontWeight: 800, fontSize: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                  >
                    Continue to Payment →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Payment */}
            {step === 3 && (
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#000000', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '2px solid #000000' }}>
                  Step 3: Payment Information
                </h2>

                <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: '0.875rem', color: '#166534', lineHeight: 1.6 }}>
                    <strong>🔒 Secure Payment</strong> — Your payment information is encrypted and secure. Payment processing will be enabled in a future update.
                  </p>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={labelStyle}>Name on Card</label>
                  <input type="text" value={cardName} onChange={e => setCardName(e.target.value)} placeholder="John Smith" style={inputStyle} />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={labelStyle}>Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={labelStyle}>Expiration Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={e => {
                        const v = e.target.value.replace(/\D/g, '');
                        setCardExpiry(v.length >= 2 ? v.slice(0, 2) + '/' + v.slice(2, 4) : v);
                      }}
                      placeholder="MM/YY"
                      maxLength={5}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>CVV</label>
                    <input type="text" value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="123" maxLength={4} style={inputStyle} />
                  </div>
                </div>

                {submitError && (
                  <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.875rem', marginBottom: '1rem', color: '#dc2626', fontSize: '0.875rem' }}>
                    {submitError}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => setStep(2)}
                    style={{ flex: 1, backgroundColor: '#ffffff', color: '#000000', border: '2px solid #000000', borderRadius: '8px', padding: '1rem', fontWeight: 700, fontSize: '0.9375rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleSubmitBooking}
                    disabled={submitting}
                    style={{ flex: 2, backgroundColor: submitting ? '#888888' : '#DC2626', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '1rem', fontWeight: 800, fontSize: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase', cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif' }}
                  >
                    {submitting ? 'Processing...' : `Confirm Booking — $${totalPrice.toFixed(2)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — Trip Summary */}
          <div style={{ position: 'sticky', top: '80px' }}>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#000000', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e5e7eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Trip Summary
              </h3>

              {/* Vehicle */}
              <div style={{ display: 'flex', gap: '0.875rem', marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ width: '80px', height: '60px', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#e5e7eb', flexShrink: 0 }}>
                  {vehicle.photos && vehicle.photos.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={vehicle.photos[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🚗</div>
                  )}
                </div>
                <div>
                  <p style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#000000', marginBottom: '0.125rem' }}>
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </p>
                  <p style={{ fontSize: '0.8125rem', color: '#666666' }}>{vehicle.category}</p>
                  <p style={{ fontSize: '0.8125rem', color: '#888888' }}>by {vehicle.host.businessName}</p>
                </div>
              </div>

              {/* Dates */}
              <div style={{ marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div>
                    <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.125rem' }}>Pickup</p>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#000000' }}>{formatDate(startDate)}</p>
                    <p style={{ fontSize: '0.8125rem', color: '#666666' }}>{pickupTime}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.125rem' }}>Return</p>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#000000' }}>{formatDate(endDate)}</p>
                    <p style={{ fontSize: '0.8125rem', color: '#666666' }}>{returnTime}</p>
                  </div>
                </div>
                <div style={{ backgroundColor: '#F5F5F5', borderRadius: '6px', padding: '0.5rem 0.75rem', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#000000' }}>{days} day{days !== 1 ? 's' : ''}</span>
                  <span style={{ fontSize: '0.8125rem', color: '#666666' }}> · {deliveryOption === 'pickup' ? 'Self Pickup' : deliveryOption === 'airport' ? 'Airport Delivery' : 'Home Delivery'}</span>
                </div>
              </div>

              {/* Price breakdown */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#555555' }}>${vehicle.dailyRate} × {days} days</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>${basePrice.toFixed(2)}</span>
                </div>
                {protectionPrice > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#555555' }}>{plan.name}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>${protectionPrice.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#555555' }}>Taxes (7%)</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>${taxes.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '2px solid #000000', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#000000' }}>Total</span>
                  <span style={{ fontSize: '1.125rem', fontWeight: 900, color: '#DC2626' }}>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <p style={{ fontSize: '0.75rem', color: '#888888', textAlign: 'center', lineHeight: 1.5 }}>
                🔒 Secure checkout. No charges until confirmed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #e5e7eb', borderTopColor: '#DC2626', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
