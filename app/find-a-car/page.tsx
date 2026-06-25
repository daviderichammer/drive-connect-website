'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Vehicle {
  id: number;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  category: string;
  dailyRate: number;
  weeklyRate: number | null;
  photos: string[];
  rating: number;
  trips: number;
  offersAirportPickup: boolean;
  offersHomeDelivery: boolean;
  unlimitedMiles: boolean;
  city: string | null;
  seats: number;
  fuelType: string;
  transmission: string;
  host: {
    id: number;
    businessName: string;
    ownerName: string;
  };
}

const VEHICLE_TYPES = ['SUV', 'Luxury SUV', 'Luxury Sedan', 'Sedan', 'Electric', 'Sports', 'Full-Size SUV', 'Van', 'Truck'];

export default function FindACarPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Filter state
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [airportDelivery, setAirportDelivery] = useState(false);
  const [homeDelivery, setHomeDelivery] = useState(false);
  const [unlimitedMiles, setUnlimitedMiles] = useState(false);
  const [minRating, setMinRating] = useState('');
  const [sortBy, setSortBy] = useState('recommended');

  const searchVehicles = useCallback(async () => {
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams();
      if (location) params.append('location', location);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      selectedCategories.forEach(c => params.append('category', c));
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (airportDelivery) params.append('airportDelivery', 'true');
      if (homeDelivery) params.append('homeDelivery', 'true');
      if (unlimitedMiles) params.append('unlimitedMiles', 'true');
      if (minRating) params.append('minRating', minRating);
      params.append('sortBy', sortBy);

      const res = await fetch(`/api/vehicles/search?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setVehicles(data.vehicles);
        setTotalCount(data.count);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, [location, startDate, endDate, selectedCategories, minPrice, maxPrice, airportDelivery, homeDelivery, unlimitedMiles, minRating, sortBy]);

  // Load all vehicles on mount
  useEffect(() => {
    searchVehicles();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
  };

  useEffect(() => {
    if (searched) {
      searchVehicles();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  const renderStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '½' : '');
  };

  return (
    <>
      {/* Page Header */}
      <section style={{ backgroundColor: '#000000', padding: '3rem 1.5rem', color: '#ffffff' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Find The Right Car At The Right Price.
          </h1>
          <p style={{ color: '#aaaaaa', fontSize: '1.0625rem' }}>
            Lower prices. Better vehicles. Simple rental process.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem', alignItems: 'start' }}>

          {/* FILTERS SIDEBAR */}
          <aside style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '1.5rem',
            position: 'sticky',
            top: '80px',
          }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#000000', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '2px solid #000000' }}>
              Search Filters
            </h2>

            {/* Location */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#333333', marginBottom: '0.375rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Pickup Location
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && searchVehicles()}
                placeholder="City or ZIP (e.g. Tampa)"
                style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.875rem', backgroundColor: '#F5F5F5', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {/* Dates */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#333333', marginBottom: '0.375rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Pickup Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.875rem', backgroundColor: '#F5F5F5', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#333333', marginBottom: '0.375rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Return Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                min={startDate || new Date().toISOString().split('T')[0]}
                style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.875rem', backgroundColor: '#F5F5F5', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {/* Vehicle Type */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#333333', marginBottom: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Vehicle Type
              </label>
              {VEHICLE_TYPES.map((type) => (
                <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(type)}
                    onChange={() => toggleCategory(type)}
                    style={{ accentColor: '#DC2626', width: '16px', height: '16px' }}
                  />
                  <span style={{ fontSize: '0.875rem', color: '#333333' }}>{type}</span>
                </label>
              ))}
            </div>

            {/* Delivery Options */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#333333', marginBottom: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Delivery Options
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={airportDelivery} onChange={e => setAirportDelivery(e.target.checked)} style={{ accentColor: '#DC2626', width: '16px', height: '16px' }} />
                <span style={{ fontSize: '0.875rem', color: '#333333' }}>Airport Delivery</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={homeDelivery} onChange={e => setHomeDelivery(e.target.checked)} style={{ accentColor: '#DC2626', width: '16px', height: '16px' }} />
                <span style={{ fontSize: '0.875rem', color: '#333333' }}>Home Delivery</span>
              </label>
            </div>

            {/* Price Range */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#333333', marginBottom: '0.375rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Price Range (per day)
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="$0" style={{ width: '100%', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.875rem', backgroundColor: '#F5F5F5', fontFamily: 'Inter, sans-serif', outline: 'none' }} />
                <span style={{ color: '#888888' }}>—</span>
                <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="$999" style={{ width: '100%', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.875rem', backgroundColor: '#F5F5F5', fontFamily: 'Inter, sans-serif', outline: 'none' }} />
              </div>
            </div>

            {/* Unlimited Miles */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={unlimitedMiles} onChange={e => setUnlimitedMiles(e.target.checked)} style={{ accentColor: '#DC2626', width: '16px', height: '16px' }} />
                <span style={{ fontSize: '0.875rem', color: '#333333', fontWeight: 600 }}>Unlimited Miles</span>
              </label>
            </div>

            {/* Operator Rating */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#333333', marginBottom: '0.375rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Minimum Rating
              </label>
              <select
                value={minRating}
                onChange={e => setMinRating(e.target.value)}
                style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.875rem', backgroundColor: '#F5F5F5', fontFamily: 'Inter, sans-serif', outline: 'none' }}
              >
                <option value="">Any Rating</option>
                <option value="4">4.0+</option>
                <option value="4.5">4.5+</option>
                <option value="4.8">4.8+</option>
                <option value="5">5.0 Only</option>
              </select>
            </div>

            <button
              onClick={searchVehicles}
              style={{ width: '100%', backgroundColor: '#DC2626', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '0.875rem', fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
            >
              Search Vehicles
            </button>
          </aside>

          {/* RESULTS */}
          <div>
            {/* Philosophy insert */}
            <div style={{ backgroundColor: '#000000', color: '#ffffff', borderRadius: '8px', padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ color: '#DC2626', fontSize: '1.25rem' }}>✦</span>
              <p style={{ fontSize: '0.9375rem', fontStyle: 'italic', margin: 0 }}>
                &ldquo;Renters deserve lower prices. And a better rental experience.&rdquo;
              </p>
            </div>

            {/* Results header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <p style={{ fontSize: '0.9375rem', color: '#555555', fontWeight: 500 }}>
                {loading ? 'Searching...' : (
                  <>Showing <strong style={{ color: '#000000' }}>{totalCount} vehicles</strong> available</>
                )}
              </p>
              <select
                value={sortBy}
                onChange={e => handleSortChange(e.target.value)}
                style={{ padding: '0.5rem 1rem', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.875rem', backgroundColor: '#ffffff', fontFamily: 'Inter, sans-serif', outline: 'none', cursor: 'pointer' }}
              >
                <option value="recommended">Sort: Recommended</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Rating: Highest</option>
                <option value="trips">Most Trips</option>
              </select>
            </div>

            {/* Loading state */}
            {loading && (
              <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <div style={{ width: '48px', height: '48px', border: '4px solid #e5e7eb', borderTopColor: '#DC2626', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
                <p style={{ color: '#666666', fontSize: '1rem' }}>Finding available vehicles...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {/* No results */}
            {!loading && searched && vehicles.length === 0 && (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: '#F5F5F5', borderRadius: '12px' }}>
                <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#000000', marginBottom: '0.5rem' }}>No vehicles found</p>
                <p style={{ color: '#666666' }}>All vehicles in this category at your selected location are currently booked. Please try different dates or another location.</p>
              </div>
            )}

            {/* Vehicle cards */}
            {!loading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', display: 'grid', gridTemplateColumns: '280px 1fr' }}
                  >
                    {/* Vehicle image */}
                    <div style={{ position: 'relative', height: '200px', overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
                      {vehicle.photos && vehicle.photos.length > 0 ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={vehicle.photos[0]}
                          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e5e7eb' }}>
                          <span style={{ fontSize: '3rem' }}>🚗</span>
                        </div>
                      )}
                      <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {vehicle.unlimitedMiles && (
                          <span style={{ backgroundColor: '#000000', color: '#ffffff', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                            Unlimited Miles
                          </span>
                        )}
                        {vehicle.offersAirportPickup && (
                          <span style={{ backgroundColor: '#DC2626', color: '#ffffff', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                            ✈ Airport Delivery
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Vehicle info */}
                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#000000', marginBottom: '0.25rem' }}>
                              {vehicle.year} {vehicle.make} {vehicle.model}
                              {vehicle.trim ? ` ${vehicle.trim}` : ''}
                            </h3>
                            <p style={{ fontSize: '0.875rem', color: '#666666' }}>{vehicle.category}</p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#DC2626', lineHeight: 1 }}>
                              ${vehicle.dailyRate}
                            </p>
                            <p style={{ fontSize: '0.75rem', color: '#888888' }}>per day</p>
                          </div>
                        </div>

                        {/* Rating & trips */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                          <span style={{ color: '#f59e0b', fontSize: '0.875rem' }}>{renderStars(vehicle.rating)}</span>
                          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#000000' }}>{vehicle.rating.toFixed(1)}</span>
                          <span style={{ fontSize: '0.875rem', color: '#888888' }}>({vehicle.trips} trips)</span>
                          {vehicle.city && (
                            <span style={{ fontSize: '0.875rem', color: '#888888' }}>• {vehicle.city}</span>
                          )}
                        </div>

                        {/* Specs */}
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.8125rem', color: '#555555' }}>👥 {vehicle.seats} seats</span>
                          <span style={{ fontSize: '0.8125rem', color: '#555555' }}>⛽ {vehicle.fuelType}</span>
                          <span style={{ fontSize: '0.8125rem', color: '#555555' }}>⚙️ {vehicle.transmission}</span>
                        </div>

                        {/* Host */}
                        <p style={{ fontSize: '0.8125rem', color: '#666666' }}>
                          Hosted by <strong style={{ color: '#000000' }}>{vehicle.host.businessName}</strong>
                        </p>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', alignItems: 'center' }}>
                        <Link
                          href={`/vehicles/${vehicle.id}${startDate ? `?startDate=${startDate}&endDate=${endDate}` : ''}`}
                          style={{ flex: 1, backgroundColor: '#DC2626', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '0.75rem 1rem', fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Inter, sans-serif', textDecoration: 'none', textAlign: 'center', display: 'block' }}
                        >
                          View Details
                        </Link>
                        <Link
                          href={`/vehicles/${vehicle.id}${startDate ? `?startDate=${startDate}&endDate=${endDate}` : ''}#book`}
                          style={{ backgroundColor: '#000000', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '0.75rem 1.25rem', fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Inter, sans-serif', textDecoration: 'none', textAlign: 'center', display: 'block' }}
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
