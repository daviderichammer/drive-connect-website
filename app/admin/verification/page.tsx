'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface RenterVerification {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  licenseNumber: string | null;
  licenseState: string | null;
  licenseImageFront: string | null;
  licenseImageBack: string | null;
  verificationStatus: string;
  verificationNotes: string | null;
  verificationReviewedAt: string | null;
  createdAt: string;
}

export default function AdminVerificationPage() {
  const router = useRouter();
  const [renters, setRenters] = useState<RenterVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [selectedRenter, setSelectedRenter] = useState<RenterVerification | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchVerifications();
  }, [statusFilter]);

  const fetchVerifications = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/verification?status=${statusFilter}`, {
        headers: { 'x-admin-auth': 'admin_authenticated' },
      });
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      setRenters(data.renters || []);
    } catch {
      console.error('Failed to fetch verifications');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (renterId: number, action: 'approve' | 'reject') => {
    setActionLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/verification', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-auth': 'admin_authenticated' },
        body: JSON.stringify({ renterId, action, notes: reviewNotes }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`Renter ${action === 'approve' ? 'verified' : 'rejected'} successfully.`);
        setSelectedRenter(null);
        setReviewNotes('');
        fetchVerifications();
      } else {
        setMessage(data.error || 'Action failed.');
      }
    } catch {
      setMessage('Network error.');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; color: string; label: string }> = {
      pending: { bg: '#fef3c7', color: '#92400e', label: 'Pending Review' },
      verified: { bg: '#d1fae5', color: '#065f46', label: 'Verified' },
      rejected: { bg: '#fee2e2', color: '#991b1b', label: 'Rejected' },
      unverified: { bg: '#f3f4f6', color: '#374151', label: 'Not Submitted' },
    };
    const s = styles[status] || styles.unverified;
    return (
      <span style={{ backgroundColor: s.bg, color: s.color, padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
        {s.label}
      </span>
    );
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <Link href="/admin/dashboard" style={{ color: '#DC2626', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
            ← Back to Dashboard
          </Link>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, marginTop: '0.5rem' }}>Identity Verification Queue</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['pending', 'verified', 'rejected', 'all'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: statusFilter === s ? '#DC2626' : '#e5e7eb',
                color: statusFilter === s ? '#fff' : '#333',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {message && (
        <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.875rem', marginBottom: '1.5rem', color: '#16a34a', fontSize: '0.875rem' }}>
          {message}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>
      ) : renters.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          No verifications with status: {statusFilter}
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {renters.map(renter => (
            <div key={renter.id} style={{ border: '1px solid #e5e7eb', borderRadius: '10px', padding: '1.25rem', backgroundColor: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '0.25rem' }}>
                    {renter.firstName} {renter.lastName}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#666', margin: 0 }}>{renter.email}</p>
                  {renter.licenseNumber && (
                    <p style={{ fontSize: '0.8125rem', color: '#888', margin: '0.25rem 0 0' }}>
                      License: {renter.licenseNumber} ({renter.licenseState})
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                  {getStatusBadge(renter.verificationStatus)}
                  <span style={{ fontSize: '0.75rem', color: '#999' }}>
                    Submitted: {new Date(renter.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* License Images */}
              {(renter.licenseImageFront || renter.licenseImageBack) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  {renter.licenseImageFront && (
                    <div>
                      <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>Front</p>
                      <a href={renter.licenseImageFront} target="_blank" rel="noopener noreferrer">
                        <img src={renter.licenseImageFront} alt="License front"
                          style={{ width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e5e7eb', cursor: 'pointer' }} />
                      </a>
                    </div>
                  )}
                  {renter.licenseImageBack && (
                    <div>
                      <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>Back</p>
                      <a href={renter.licenseImageBack} target="_blank" rel="noopener noreferrer">
                        <img src={renter.licenseImageBack} alt="License back"
                          style={{ width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e5e7eb', cursor: 'pointer' }} />
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Action Panel */}
              {renter.verificationStatus === 'pending' && (
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                  {selectedRenter?.id === renter.id ? (
                    <div>
                      <textarea
                        value={reviewNotes}
                        onChange={e => setReviewNotes(e.target.value)}
                        placeholder="Optional notes (required for rejection)..."
                        rows={2}
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.875rem', marginBottom: '0.75rem', fontFamily: 'Inter, sans-serif', resize: 'vertical', boxSizing: 'border-box' }}
                      />
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                          onClick={() => handleAction(renter.id, 'approve')}
                          disabled={actionLoading}
                          style={{ flex: 1, backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.75rem', fontWeight: 700, cursor: actionLoading ? 'not-allowed' : 'pointer' }}
                        >
                          ✓ Approve & Verify
                        </button>
                        <button
                          onClick={() => handleAction(renter.id, 'reject')}
                          disabled={actionLoading}
                          style={{ flex: 1, backgroundColor: '#DC2626', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.75rem', fontWeight: 700, cursor: actionLoading ? 'not-allowed' : 'pointer' }}
                        >
                          ✗ Reject
                        </button>
                        <button
                          onClick={() => { setSelectedRenter(null); setReviewNotes(''); }}
                          style={{ backgroundColor: '#e5e7eb', color: '#333', border: 'none', borderRadius: '6px', padding: '0.75rem 1rem', fontWeight: 600, cursor: 'pointer' }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedRenter(renter)}
                      style={{ backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.625rem 1.25rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}
                    >
                      Review This Submission
                    </button>
                  )}
                </div>
              )}

              {renter.verificationNotes && (
                <div style={{ marginTop: '0.75rem', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '6px', fontSize: '0.8125rem', color: '#555' }}>
                  <strong>Notes:</strong> {renter.verificationNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
