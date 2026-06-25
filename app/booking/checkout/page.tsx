'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder'
);

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

interface PricingBreakdown {
  days: number;
  basePrice: number;
  pricingMultiplier: number;
  durationDiscount: number;
  earlyBirdDiscount: number;
  discountedBase: number;
  protectionPrice: number;
  insuranceAmount: number;
  deliveryPrice: number;
  taxes: number;
  totalPrice: number;
}

const PROTECTION_PLANS: Record<string, { name: string; price: number; description: string; deductible: string }> = {
  none: { name: 'No Protection', price: 0, description: 'You are responsible for all damages.', deductible: 'Full cost' },
  basic: { name: 'Basic Protection', price: 15, description: 'Covers most common damage scenarios.', deductible: '$2,500' },
  standard: { name: 'Standard Protection', price: 29, description: 'Comprehensive coverage for peace of mind.', deductible: '$1,000' },
  premium: { name: 'Premium Protection', price: 49, description: 'Full coverage, zero out-of-pocket risk.', deductible: '$0' },
};

const INSURANCE_TIERS: Record<string, { name: string; price: number; description: string; coverage: string }> = {
  basic: { name: 'Basic Insurance', price: 9.99, description: 'Liability coverage up to $50,000.', coverage: '$50K liability' },
  standard: { name: 'Standard Insurance', price: 14.99, description: 'Comprehensive + collision up to $100,000.', coverage: '$100K comprehensive' },
  premium: { name: 'Premium Insurance', price: 24.99, description: 'Full coverage including roadside assistance.', coverage: 'Full + roadside' },
};

const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'];

// Payment Form Component (uses Stripe hooks - must be inside Elements)
function PaymentForm({
  clientSecret,
  bookingData,
  pricing,
  onSuccess,
  onError,
}: {
  clientSecret: string;
  bookingData: Record<string, unknown>;
  pricing: PricingBreakdown;
  onSuccess: (ref: string) => void;
  onError: (msg: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      onError(error.message || 'Payment failed. Please try again.');
      setProcessing(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Confirm booking on server
      try {
        const res = await fetch('/api/payments/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            ...bookingData,
          }),
        });
        const data = await res.json();
        if (data.success) {
          onSuccess(data.booking.bookingReference);
        } else {
          onError(data.error || 'Booking confirmation failed.');
        }
      } catch {
        onError('Network error during booking confirmation.');
      }
    } else {
      onError('Payment was not completed. Please try again.');
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '1.5rem' }}>
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>
      <button
        type="submit"
        disabled={!stripe || processing}
        style={{
          width: '100%',
          backgroundColor: processing ? '#888' : '#DC2626',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          padding: '1rem',
          fontWeight: 800,
          fontSize: '1rem',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          cursor: processing ? 'not-allowed' : 'pointer',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {processing ? 'Processing Payment...' : `Pay $${pricing.totalPrice.toFixed(2)}`}
      </button>
      <p style={{ fontSize: '0.75rem', color: '#888', textAlign: 'center', marginTop: '0.75rem' }}>
        🔒 Secured by Stripe. Your payment info is encrypted.
      </p>
    </form>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const vehicleId = searchParams.get('vehicleId') || '';
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';
  const pickupTime = searchParams.get('pickupTime') || '10:00';
  const returnTime = searchParams.get('returnTime') || '10:00';
  const deliveryOption = searchParams.get('deliveryOption') || 'pickup';
  const protectionPlanParam = searchParams.get('protectionPlan') || 'standard';

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

  // Insurance state
  const [selectedInsurance, setSelectedInsurance] = useState<string>('standard');
  const [selectedProtection, setSelectedProtection] = useState(protectionPlanParam);

  // Payment state
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [pricing, setPricing] = useState<PricingBreakdown | null>(null);
  const [creatingIntent, setCreatingIntent] = useState(false);

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
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  const validateStep1 = () => {
    return firstName.trim() && lastName.trim() && email.trim() && phone.trim() &&
      licenseNumber.trim() && licenseState && agreeTerms && agreeAge;
  };

  const handleProceedToPayment = async () => {
    if (!validateStep1()) {
      setSubmitError('Please complete all required fields and agree to the terms.');
      return;
    }
    setCreatingIntent(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: parseInt(vehicleId),
          startDate,
          endDate,
          pickupTime,
          returnTime,
          deliveryOption,
          protectionPlan: selectedProtection,
          insuranceTier: selectedInsurance,
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
        setClientSecret(data.clientSecret);
        setPaymentIntentId(data.paymentIntentId);
        setPricing(data.pricing);
        setStep(3);
      } else {
        setSubmitError(data.error || 'Failed to initialize payment. Please try again.');
      }
    } catch {
      setSubmitError('Network error. Please try again.');
    } finally {
      setCreatingIntent(false);
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

  const plan = PROTECTION_PLANS[selectedProtection] || PROTECTION_PLANS.standard;
  const insurance = INSURANCE_TIERS[selectedInsurance];
  const days = pricing?.days || Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
  const estimatedBase = days * vehicle.dailyRate;
  const estimatedProtection = plan.price * days;
  const estimatedInsurance = insurance ? insurance.price * days : 0;
  const estimatedSubtotal = estimatedBase + estimatedProtection + estimatedInsurance;
  const estimatedTax = estimatedSubtotal * 0.07;
  const estimatedTotal = estimatedSubtotal + estimatedTax;

  const displayPricing = pricing || {
    days,
    basePrice: estimatedBase,
    pricingMultiplier: 1.0,
    durationDiscount: 0,
    earlyBirdDiscount: 0,
    discountedBase: estimatedBase,
    protectionPrice: estimatedProtection,
    insuranceAmount: estimatedInsurance,
    deliveryPrice: 0,
    taxes: estimatedTax,
    totalPrice: estimatedTotal,
  };

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
            { num: 2, label: 'Insurance' },
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
                      I agree to the Drive Connect <Link href="/protection-plans" style={{ color: '#DC2626', textDecoration: 'none', fontWeight: 600 }}>Rental Terms & Conditions</Link>.
                    </span>
                  </label>
                </div>

                {submitError && (
                  <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.875rem', marginBottom: '1rem', color: '#dc2626', fontSize: '0.875rem' }}>
                    {submitError}
                  </div>
                )}

                <button
                  onClick={() => {
                    if (validateStep1()) { setStep(2); setSubmitError(''); }
                    else { setSubmitError('Please complete all required fields.'); }
                  }}
                  style={{ width: '100%', backgroundColor: '#DC2626', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '1rem', fontWeight: 800, fontSize: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                >
                  Continue to Insurance →
                </button>
              </div>
            )}

            {/* STEP 2: Insurance Selection */}
            {step === 2 && (
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#000000', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '2px solid #000000' }}>
                  Step 2: Insurance & Protection
                </h2>

                {/* Protection Plan */}
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#333' }}>Protection Plan</h3>
                <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {Object.entries(PROTECTION_PLANS).map(([key, p]) => (
                    <label key={key} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '1rem',
                      padding: '1rem', border: `2px solid ${selectedProtection === key ? '#DC2626' : '#e5e7eb'}`,
                      borderRadius: '8px', cursor: 'pointer', backgroundColor: selectedProtection === key ? '#fff5f5' : '#fff',
                    }}>
                      <input type="radio" name="protection" value={key} checked={selectedProtection === key}
                        onChange={() => setSelectedProtection(key)}
                        style={{ accentColor: '#DC2626', marginTop: '2px', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{p.name}</span>
                          <span style={{ fontWeight: 800, color: '#DC2626' }}>
                            {p.price === 0 ? 'Free' : `$${p.price}/day`}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.8125rem', color: '#666', margin: '0.25rem 0 0' }}>{p.description} Deductible: {p.deductible}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Insurance Tier */}
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#333' }}>Insurance Coverage</h3>
                <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {Object.entries(INSURANCE_TIERS).map(([key, ins]) => (
                    <label key={key} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '1rem',
                      padding: '1rem', border: `2px solid ${selectedInsurance === key ? '#DC2626' : '#e5e7eb'}`,
                      borderRadius: '8px', cursor: 'pointer', backgroundColor: selectedInsurance === key ? '#fff5f5' : '#fff',
                    }}>
                      <input type="radio" name="insurance" value={key} checked={selectedInsurance === key}
                        onChange={() => setSelectedInsurance(key)}
                        style={{ accentColor: '#DC2626', marginTop: '2px', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{ins.name}</span>
                          <span style={{ fontWeight: 800, color: '#DC2626' }}>${ins.price}/day</span>
                        </div>
                        <p style={{ fontSize: '0.8125rem', color: '#666', margin: '0.25rem 0 0' }}>
                          {ins.description} <strong>{ins.coverage}</strong>
                        </p>
                      </div>
                    </label>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={() => setStep(1)}
                    style={{ flex: 1, backgroundColor: '#fff', color: '#000', border: '2px solid #000', borderRadius: '8px', padding: '1rem', fontWeight: 700, fontSize: '0.9375rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleProceedToPayment}
                    disabled={creatingIntent}
                    style={{ flex: 2, backgroundColor: creatingIntent ? '#888' : '#DC2626', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '1rem', fontWeight: 800, fontSize: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase', cursor: creatingIntent ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif' }}
                  >
                    {creatingIntent ? 'Preparing Payment...' : 'Continue to Payment →'}
                  </button>
                </div>

                {submitError && (
                  <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.875rem', marginTop: '1rem', color: '#dc2626', fontSize: '0.875rem' }}>
                    {submitError}
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: Payment */}
            {step === 3 && clientSecret && (
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#000000', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '2px solid #000000' }}>
                  Step 3: Secure Payment
                </h2>

                {/* Price Breakdown */}
                {pricing && (
                  <div style={{ backgroundColor: '#F5F5F5', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Price Breakdown</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>${vehicle.dailyRate}/day × {pricing.days} days</span>
                        <span>${pricing.basePrice.toFixed(2)}</span>
                      </div>
                      {pricing.pricingMultiplier > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#DC2626' }}>
                          <span>Peak season/weekend multiplier ({((pricing.pricingMultiplier - 1) * 100).toFixed(0)}%)</span>
                          <span>+${((pricing.basePrice / pricing.pricingMultiplier) * (pricing.pricingMultiplier - 1)).toFixed(2)}</span>
                        </div>
                      )}
                      {pricing.durationDiscount > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
                          <span>Duration discount ({pricing.days >= 28 ? '20%' : '10%'})</span>
                          <span>-${pricing.durationDiscount.toFixed(2)}</span>
                        </div>
                      )}
                      {pricing.earlyBirdDiscount > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
                          <span>Early bird discount (5%)</span>
                          <span>-${pricing.earlyBirdDiscount.toFixed(2)}</span>
                        </div>
                      )}
                      {pricing.protectionPrice > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Protection: {PROTECTION_PLANS[selectedProtection]?.name}</span>
                          <span>${pricing.protectionPrice.toFixed(2)}</span>
                        </div>
                      )}
                      {pricing.insuranceAmount > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Insurance: {INSURANCE_TIERS[selectedInsurance]?.name}</span>
                          <span>${pricing.insuranceAmount.toFixed(2)}</span>
                        </div>
                      )}
                      {pricing.deliveryPrice > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Delivery fee</span>
                          <span>${pricing.deliveryPrice.toFixed(2)}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Taxes & fees (7%)</span>
                        <span>${pricing.taxes.toFixed(2)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1rem', borderTop: '1px solid #ddd', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                        <span>Total</span>
                        <span style={{ color: '#DC2626' }}>${pricing.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {submitError && (
                  <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.875rem', marginBottom: '1rem', color: '#dc2626', fontSize: '0.875rem' }}>
                    {submitError}
                  </div>
                )}

                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: 'stripe',
                      variables: {
                        colorPrimary: '#DC2626',
                        colorBackground: '#ffffff',
                        fontFamily: 'Inter, sans-serif',
                      },
                    },
                  }}
                >
                  <PaymentForm
                    clientSecret={clientSecret}
                    bookingData={{
                      vehicleId: parseInt(vehicleId),
                      startDate,
                      endDate,
                      pickupTime,
                      returnTime,
                      deliveryOption,
                      protectionPlan: selectedProtection,
                      insuranceTier: selectedInsurance,
                      renterFirstName: firstName,
                      renterLastName: lastName,
                      renterEmail: email,
                      renterPhone: phone,
                      renterLicenseNumber: licenseNumber,
                      renterLicenseState: licenseState,
                    }}
                    pricing={pricing || displayPricing}
                    onSuccess={(ref) => router.push(`/booking/confirmation/${ref}`)}
                    onError={(msg) => setSubmitError(msg)}
                  />
                </Elements>

                <button
                  onClick={() => setStep(2)}
                  style={{ width: '100%', marginTop: '1rem', backgroundColor: '#fff', color: '#000', border: '2px solid #e5e7eb', borderRadius: '8px', padding: '0.75rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                >
                  ← Back to Insurance
                </button>
              </div>
            )}
          </div>

          {/* RIGHT — Booking Summary */}
          <div style={{ position: 'sticky', top: '1.5rem' }}>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
              {/* Vehicle Image */}
              {vehicle.photos && vehicle.photos.length > 0 ? (
                <img src={vehicle.photos[0]} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '180px', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '3rem' }}>🚗</span>
                </div>
              )}

              <div style={{ padding: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                  {vehicle.year} {vehicle.make} {vehicle.model}
                  {vehicle.trim && ` ${vehicle.trim}`}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: '#666', marginBottom: '1rem' }}>
                  Hosted by {vehicle.host.businessName}
                </p>

                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                    <span style={{ color: '#666' }}>Pickup</span>
                    <span style={{ fontWeight: 600 }}>{formatDate(startDate)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span style={{ color: '#666' }}>Return</span>
                    <span style={{ fontWeight: 600 }}>{formatDate(endDate)}</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem', fontSize: '0.875rem' }}>
                    <span style={{ color: '#666' }}>${vehicle.dailyRate}/day × {displayPricing.days} days</span>
                    <span>${displayPricing.basePrice.toFixed(2)}</span>
                  </div>
                  {displayPricing.durationDiscount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem', fontSize: '0.875rem', color: '#16a34a' }}>
                      <span>Duration discount</span>
                      <span>-${displayPricing.durationDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  {displayPricing.earlyBirdDiscount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem', fontSize: '0.875rem', color: '#16a34a' }}>
                      <span>Early bird (5%)</span>
                      <span>-${displayPricing.earlyBirdDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem', fontSize: '0.875rem' }}>
                    <span style={{ color: '#666' }}>Protection</span>
                    <span>${displayPricing.protectionPrice.toFixed(2)}</span>
                  </div>
                  {displayPricing.insuranceAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem', fontSize: '0.875rem' }}>
                      <span style={{ color: '#666' }}>Insurance</span>
                      <span>${displayPricing.insuranceAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                    <span style={{ color: '#666' }}>Taxes (7%)</span>
                    <span>${displayPricing.taxes.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.125rem', borderTop: '2px solid #000', paddingTop: '0.75rem' }}>
                    <span>Total</span>
                    <span style={{ color: '#DC2626' }}>${displayPricing.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Test Mode Notice */}
            <div style={{ marginTop: '1rem', padding: '0.875rem', backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', fontSize: '0.8125rem', color: '#92400e' }}>
              <strong>Test Mode:</strong> Use card 4242 4242 4242 4242, any future date, any CVV.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function CheckoutPageInner() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid #e5e7eb', borderTopColor: '#DC2626', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{color:"#888",padding:"40px",textAlign:"center"}}>Loading...</div>}>
      <CheckoutPageInner />
    </Suspense>
  );
}
