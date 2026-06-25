'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface InsuranceTier {
  id: string;
  name: string;
  dailyRate: number;
  description: string;
  coverage: string[];
  notCovered: string[];
  deductible: string;
  color: string;
  icon: string;
  popular?: boolean;
  totalCost?: number;
  days?: number;
}

export default function InsurancePage() {
  const [tiers, setTiers] = useState<InsuranceTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDays, setSelectedDays] = useState(3);

  useEffect(() => {
    fetchTiers();
  }, [selectedDays]);

  const fetchTiers = async () => {
    try {
      const res = await fetch(`/api/insurance?days=${selectedDays}`);
      const data = await res.json();
      if (data.success) setTiers(data.tiers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <section style={{ backgroundColor: '#000000', padding: '4rem 1.5rem', color: '#ffffff', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            Drive Connect Insurance
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#aaaaaa', lineHeight: 1.7, maxWidth: '600px', margin: '0 auto' }}>
            Every Drive Connect rental includes your choice of insurance coverage. 
            Drive with confidence knowing you&apos;re protected.
          </p>
        </div>
      </section>

      {/* Days Calculator */}
      <section style={{ backgroundColor: '#F5F5F5', padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Calculate for:</span>
          {[1, 3, 7, 14, 30].map(d => (
            <button
              key={d}
              onClick={() => setSelectedDays(d)}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '6px',
                border: selectedDays === d ? 'none' : '1px solid #e5e7eb',
                backgroundColor: selectedDays === d ? '#DC2626' : '#ffffff',
                color: selectedDays === d ? '#ffffff' : '#333',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
              } as React.CSSProperties}
            >
              {d} {d === 1 ? 'day' : 'days'}
            </button>
          ))}
        </div>
      </section>

      {/* Tiers */}
      <section style={{ padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {tiers.map(tier => (
                <div key={tier.id} style={{
                  border: `2px solid ${tier.popular ? '#DC2626' : '#e5e7eb'}`,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: '#fff',
                }}>
                  {tier.popular && (
                    <div style={{ backgroundColor: '#DC2626', color: '#fff', textAlign: 'center', padding: '0.375rem', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      Most Popular
                    </div>
                  )}
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '2rem' }}>{tier.icon}</span>
                      <div>
                        <h3 style={{ fontWeight: 800, fontSize: '1.125rem', margin: 0 }}>{tier.name}</h3>
                        <p style={{ fontSize: '0.8125rem', color: '#666', margin: 0 }}>{tier.description}</p>
                      </div>
                    </div>

                    <div style={{ marginBottom: '1.25rem', padding: '1rem', backgroundColor: '#F5F5F5', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 900, color: '#DC2626' }}>
                        ${tier.dailyRate}/day
                      </div>
                      {selectedDays > 1 && (
                        <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
                          ${tier.totalCost?.toFixed(2)} for {selectedDays} days
                        </div>
                      )}
                      <div style={{ fontSize: '0.8125rem', color: '#888', marginTop: '0.25rem' }}>
                        Deductible: <strong>{tier.deductible}</strong>
                      </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <h4 style={{ fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', color: '#333' }}>
                        What&apos;s Covered
                      </h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {tier.coverage.map((item, i) => (
                          <li key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', color: '#333' }}>
                            <span style={{ color: '#16a34a', fontWeight: 700, flexShrink: 0 }}>✓</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {tier.notCovered.length > 0 && (
                      <div>
                        <h4 style={{ fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', color: '#666' }}>
                          Not Covered
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {tier.notCovered.map((item, i) => (
                            <li key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', color: '#999' }}>
                              <span style={{ color: '#dc2626', fontWeight: 700, flexShrink: 0 }}>✗</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ backgroundColor: '#F5F5F5', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, textAlign: 'center', marginBottom: '2rem' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              {
                q: 'Is insurance required for every rental?',
                a: 'Yes, all Drive Connect rentals require at least Basic Coverage. This protects both you and the vehicle owner.',
              },
              {
                q: 'What happens if I have my own auto insurance?',
                a: 'Your personal auto insurance may provide some coverage, but Drive Connect insurance ensures you have guaranteed protection without involving your personal policy.',
              },
              {
                q: 'How do I file a claim?',
                a: 'Contact Drive Connect support immediately after any incident. We\'ll guide you through the claims process and coordinate with our insurance partners.',
              },
              {
                q: 'Does insurance cover international drivers?',
                a: 'Yes, Drive Connect insurance covers all licensed drivers regardless of where their license was issued, as long as it\'s valid in the US.',
              },
            ].map((faq, i) => (
              <div key={i} style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '1.25rem', border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.5rem' }}>{faq.q}</h3>
                <p style={{ fontSize: '0.875rem', color: '#555', margin: 0, lineHeight: 1.6 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '1rem' }}>Ready to Book?</h2>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>Choose your insurance coverage during checkout when you book your vehicle.</p>
          <Link href="/find-a-car" style={{
            display: 'inline-block',
            backgroundColor: '#DC2626',
            color: '#ffffff',
            padding: '1rem 2.5rem',
            borderRadius: '8px',
            fontWeight: 800,
            fontSize: '1rem',
            textDecoration: 'none',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>
            Find a Car
          </Link>
        </div>
      </section>
    </>
  );
}
