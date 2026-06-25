'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Booking {
  id: number;
  bookingReference: string;
  vehicleId: number;
  renterFirstName: string;
  renterLastName: string;
  renterEmail: string;
  renterPhone: string;
  startDate: string;
  endDate: string;
  pickupTime: string;
  returnTime: string;
  deliveryOption: string;
  protectionPlan: string;
  basePrice: number;
  protectionPrice: number;
  deliveryPrice: number;
  taxes: number;
  totalPrice: number;
  status: string;
  days: number;
  vehicle: {
    id: number;
    year: number;
    make: string;
    model: string;
    trim: string | null;
    category: string;
    dailyRate: number;
    photos: string[];
    city: string | null;
    securityDeposit: number | null;
    host: {
      businessName: string;
      ownerName: string;
      phone: string | null;
    };
  };
}

const PROTECTION_PLAN_NAMES: Record<string, string> = {
  none: 'No Protection',
  basic: 'Basic Protection',
  standard: 'Standard Protection',
  premium: 'Premium Protection',
};

export default function ConfirmationPage() {
  const params = useParams();
  const ref = params.ref as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await fetch(`/api/bookings/${ref}`);
        const data = await res.json();
        if (data.success) {
          setBooking(data.booking);
        } else {
          setError('Booking not found');
        }
      } catch {
        setError('Failed to load booking');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [ref]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    });
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

  if (error || !booking) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>Booking not found</p>
        <Link href="/find-a-car" style={{ color: '#DC2626', textDecoration: 'none', fontWeight: 600 }}>← Find A Car</Link>
      </div>
    );
  }

  return (
    <>
      {/* Success Header */}
      <section style={{ backgroundColor: '#000000', padding: '3rem 1.5rem', color: '#ffffff', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '2rem' }}>
            ✓
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Booking Confirmed!
          </h1>
          <p style={{ color: '#aaaaaa', fontSize: '1.0625rem', marginBottom: '1rem' }}>
            Your reservation has been successfully created.
          </p>
          <div style={{ backgroundColor: '#1a1a1a', borderRadius: '8px', padding: '0.875rem 1.5rem', display: 'inline-block' }}>
            <p style={{ fontSize: '0.75rem', color: '#888888', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Booking Reference</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#DC2626', letterSpacing: '0.1em', fontFamily: 'monospace' }}>{booking.bookingReference}</p>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>

          {/* Vehicle Info */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#888888', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Your Vehicle</h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '100px', height: '72px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#e5e7eb', flexShrink: 0 }}>
                {booking.vehicle.photos && booking.vehicle.photos.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={booking.vehicle.photos[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🚗</div>
                )}
              </div>
              <div>
                <p style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#000000', marginBottom: '0.25rem' }}>
                  {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}
                  {booking.vehicle.trim ? ` ${booking.vehicle.trim}` : ''}
                </p>
                <p style={{ fontSize: '0.875rem', color: '#666666', marginBottom: '0.25rem' }}>{booking.vehicle.category}</p>
                <p style={{ fontSize: '0.875rem', color: '#888888' }}>
                  Hosted by <strong style={{ color: '#000000' }}>{booking.vehicle.host.businessName}</strong>
                </p>
                {booking.vehicle.city && (
                  <p style={{ fontSize: '0.8125rem', color: '#888888', marginTop: '0.25rem' }}>📍 {booking.vehicle.city}</p>
                )}
              </div>
            </div>
          </div>

          {/* Trip Dates */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#888888', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Trip Dates</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div>
                <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#DC2626', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Pickup</p>
                <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#000000' }}>{formatDate(booking.startDate)}</p>
                <p style={{ fontSize: '0.875rem', color: '#666666' }}>at {booking.pickupTime}</p>
              </div>
              <div style={{ height: '1px', backgroundColor: '#e5e7eb' }} />
              <div>
                <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#DC2626', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Return</p>
                <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#000000' }}>{formatDate(booking.endDate)}</p>
                <p style={{ fontSize: '0.875rem', color: '#666666' }}>at {booking.returnTime}</p>
              </div>
              <div style={{ backgroundColor: '#F5F5F5', borderRadius: '6px', padding: '0.5rem 0.75rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{booking.days} day{booking.days !== 1 ? 's' : ''}</span>
                <span style={{ fontSize: '0.8125rem', color: '#666666' }}> · {booking.deliveryOption === 'pickup' ? 'Self Pickup' : booking.deliveryOption === 'airport' ? 'Airport Delivery' : 'Home Delivery'}</span>
              </div>
            </div>
          </div>

          {/* Renter Info */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#888888', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Renter Information</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <div>
                <p style={{ fontSize: '0.6875rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.125rem' }}>Name</p>
                <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#000000' }}>{booking.renterFirstName} {booking.renterLastName}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.6875rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.125rem' }}>Email</p>
                <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#000000' }}>{booking.renterEmail}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.6875rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.125rem' }}>Phone</p>
                <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#000000' }}>{booking.renterPhone}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.6875rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.125rem' }}>Protection Plan</p>
                <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#000000' }}>{PROTECTION_PLAN_NAMES[booking.protectionPlan] || booking.protectionPlan}</p>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#888888', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Payment Summary</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.875rem', color: '#555555' }}>Base rental</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>${booking.basePrice.toFixed(2)}</span>
              </div>
              {booking.protectionPrice > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.875rem', color: '#555555' }}>Protection plan</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>${booking.protectionPrice.toFixed(2)}</span>
                </div>
              )}
              {booking.deliveryPrice > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.875rem', color: '#555555' }}>Delivery fee</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>${booking.deliveryPrice.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.875rem', color: '#555555' }}>Taxes</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>${booking.taxes.toFixed(2)}</span>
              </div>
              {booking.vehicle.securityDeposit && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.875rem', color: '#c2410c' }}>Security deposit (refundable)</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#c2410c' }}>${booking.vehicle.securityDeposit.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '2px solid #000000', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#000000' }}>Total Charged</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#DC2626' }}>${booking.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* What Happens Next */}
        <div style={{ backgroundColor: '#000000', borderRadius: '12px', padding: '2rem', marginBottom: '2rem', color: '#ffffff' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.01em' }}>What Happens Next</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {[
              { step: '01', icon: '📧', title: 'Confirmation Email', desc: 'A confirmation email has been sent to your email address with all booking details.' },
              { step: '02', icon: '📞', title: 'Host Contact', desc: `${booking.vehicle.host.businessName} will reach out to coordinate pickup/delivery details.` },
              { step: '03', icon: '🚗', title: 'Enjoy Your Trip', desc: 'Pick up your vehicle at the agreed time and enjoy your Drive Connect experience.' },
            ].map(item => (
              <div key={item.step} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{item.icon}</div>
                <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#DC2626', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.375rem' }}>Step {item.step}</p>
                <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.375rem' }}>{item.title}</p>
                <p style={{ fontSize: '0.8125rem', color: '#aaaaaa', lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Host Contact */}
        {booking.vehicle.host.phone && (
          <div style={{ backgroundColor: '#F5F5F5', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Host Contact</p>
              <p style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#000000' }}>{booking.vehicle.host.businessName}</p>
              <p style={{ fontSize: '0.9375rem', color: '#333333' }}>{booking.vehicle.host.phone}</p>
            </div>
            <a
              href={`tel:${booking.vehicle.host.phone}`}
              style={{ backgroundColor: '#DC2626', color: '#ffffff', textDecoration: 'none', borderRadius: '8px', padding: '0.75rem 1.5rem', fontWeight: 700, fontSize: '0.9375rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}
            >
              Call Host
            </a>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link
            href="/find-a-car"
            style={{ backgroundColor: '#000000', color: '#ffffff', textDecoration: 'none', borderRadius: '8px', padding: '0.875rem 2rem', fontWeight: 700, fontSize: '0.9375rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}
          >
            Find Another Car
          </Link>
          <button
            onClick={() => window.print()}
            style={{ backgroundColor: '#ffffff', color: '#000000', border: '2px solid #000000', borderRadius: '8px', padding: '0.875rem 2rem', fontWeight: 700, fontSize: '0.9375rem', letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
          >
            Print Confirmation
          </button>
        </div>
      </div>
    </>
  );
}
