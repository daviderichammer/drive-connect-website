'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'];

interface VerificationStatus {
  status: string;
  licenseImageFront: string | null;
  licenseImageBack: string | null;
  verificationNotes: string | null;
  verificationReviewedAt: string | null;
  licenseNumber: string | null;
  licenseState: string | null;
}

export default function VerificationPage() {
  const [verification, setVerification] = useState<VerificationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseState, setLicenseState] = useState('FL');

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchVerification();
  }, []);

  const fetchVerification = async () => {
    try {
      const res = await fetch('/api/renter/verification');
      const data = await res.json();
      if (data.success) {
        setVerification(data.verification);
        if (data.verification.licenseNumber) setLicenseNumber(data.verification.licenseNumber);
        if (data.verification.licenseState) setLicenseState(data.verification.licenseState);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (side: 'front' | 'back', file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (side === 'front') {
        setFrontPreview(e.target?.result as string);
        setFrontFile(file);
      } else {
        setBackPreview(e.target?.result as string);
        setBackFile(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!frontFile || !backFile) {
      setError('Please upload both front and back of your driver\'s license.');
      return;
    }
    if (!licenseNumber.trim()) {
      setError('Please enter your license number.');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('frontImage', frontFile);
    formData.append('backImage', backFile);
    formData.append('licenseNumber', licenseNumber);
    formData.append('licenseState', licenseState);

    try {
      const res = await fetch('/api/renter/verification', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(data.message);
        fetchVerification();
      } else {
        setError(data.error || 'Upload failed. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return '#16a34a';
      case 'pending': return '#d97706';
      case 'rejected': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'verified': return '✓ Verified';
      case 'pending': return '⏳ Under Review';
      case 'rejected': return '✗ Rejected';
      default: return 'Not Submitted';
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

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #e5e7eb', borderTopColor: '#DC2626', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/renter/dashboard" style={{ color: '#DC2626', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
          ← Back to Dashboard
        </Link>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, marginTop: '0.75rem', marginBottom: '0.5rem' }}>
          Identity Verification
        </h1>
        <p style={{ color: '#666', fontSize: '0.9375rem', lineHeight: 1.6 }}>
          Upload your driver&apos;s license to verify your identity. This is required to complete bookings.
        </p>
      </div>

      {/* Current Status */}
      {verification && (
        <div style={{
          padding: '1.25rem',
          borderRadius: '10px',
          border: `2px solid ${getStatusColor(verification.status)}`,
          backgroundColor: verification.status === 'verified' ? '#f0fdf4' : verification.status === 'pending' ? '#fffbeb' : verification.status === 'rejected' ? '#fef2f2' : '#f9fafb',
          marginBottom: '2rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: verification.verificationNotes ? '0.75rem' : 0 }}>
            <span style={{ fontSize: '1.5rem' }}>
              {verification.status === 'verified' ? '🛡️' : verification.status === 'pending' ? '⏳' : verification.status === 'rejected' ? '❌' : '📋'}
            </span>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: getStatusColor(verification.status) }}>
                {getStatusLabel(verification.status)}
              </div>
              {verification.verificationReviewedAt && (
                <div style={{ fontSize: '0.8125rem', color: '#666' }}>
                  Reviewed: {new Date(verification.verificationReviewedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
          {verification.verificationNotes && (
            <p style={{ fontSize: '0.875rem', color: '#555', margin: 0, paddingTop: '0.75rem', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
              <strong>Notes:</strong> {verification.verificationNotes}
            </p>
          )}
        </div>
      )}

      {/* Show existing images if already submitted */}
      {verification && verification.licenseImageFront && verification.status !== 'rejected' && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Submitted Documents</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Front</p>
              <img src={verification.licenseImageFront} alt="License front"
                style={{ width: '100%', borderRadius: '8px', border: '1px solid #e5e7eb', objectFit: 'cover', maxHeight: '160px' }} />
            </div>
            {verification.licenseImageBack && (
              <div>
                <p style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Back</p>
                <img src={verification.licenseImageBack} alt="License back"
                  style={{ width: '100%', borderRadius: '8px', border: '1px solid #e5e7eb', objectFit: 'cover', maxHeight: '160px' }} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Form — show if unverified or rejected */}
      {(!verification || verification.status === 'unverified' || verification.status === 'rejected') && (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '2px solid #000' }}>
            {verification?.status === 'rejected' ? 'Resubmit Verification' : 'Submit Verification'}
          </h2>

          {/* License Number */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                License Number *
              </label>
              <input
                type="text"
                value={licenseNumber}
                onChange={e => setLicenseNumber(e.target.value)}
                placeholder="D123-456-78-901-0"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                Issuing State *
              </label>
              <select value={licenseState} onChange={e => setLicenseState(e.target.value)} style={inputStyle}>
                {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Upload Areas */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            {/* Front */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                Front of License *
              </label>
              <div
                onClick={() => frontInputRef.current?.click()}
                style={{
                  border: `2px dashed ${frontPreview ? '#DC2626' : '#d1d5db'}`,
                  borderRadius: '8px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: frontPreview ? '#fff5f5' : '#fafafa',
                  minHeight: '160px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {frontPreview ? (
                  <img src={frontPreview} alt="Front preview" style={{ maxWidth: '100%', maxHeight: '130px', borderRadius: '4px', objectFit: 'cover' }} />
                ) : (
                  <>
                    <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📷</span>
                    <p style={{ fontSize: '0.8125rem', color: '#666', margin: 0 }}>Click to upload front</p>
                    <p style={{ fontSize: '0.75rem', color: '#999', margin: '0.25rem 0 0' }}>JPG, PNG, HEIC</p>
                  </>
                )}
              </div>
              <input
                ref={frontInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => handleFileChange('front', e.target.files?.[0] || null)}
              />
            </div>

            {/* Back */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                Back of License *
              </label>
              <div
                onClick={() => backInputRef.current?.click()}
                style={{
                  border: `2px dashed ${backPreview ? '#DC2626' : '#d1d5db'}`,
                  borderRadius: '8px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: backPreview ? '#fff5f5' : '#fafafa',
                  minHeight: '160px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {backPreview ? (
                  <img src={backPreview} alt="Back preview" style={{ maxWidth: '100%', maxHeight: '130px', borderRadius: '4px', objectFit: 'cover' }} />
                ) : (
                  <>
                    <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📷</span>
                    <p style={{ fontSize: '0.8125rem', color: '#666', margin: 0 }}>Click to upload back</p>
                    <p style={{ fontSize: '0.75rem', color: '#999', margin: '0.25rem 0 0' }}>JPG, PNG, HEIC</p>
                  </>
                )}
              </div>
              <input
                ref={backInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => handleFileChange('back', e.target.files?.[0] || null)}
              />
            </div>
          </div>

          {error && (
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.875rem', marginBottom: '1rem', color: '#dc2626', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.875rem', marginBottom: '1rem', color: '#16a34a', fontSize: '0.875rem' }}>
              {success}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={uploading}
            style={{
              width: '100%',
              backgroundColor: uploading ? '#888' : '#DC2626',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '1rem',
              fontWeight: 800,
              fontSize: '1rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              cursor: uploading ? 'not-allowed' : 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {uploading ? 'Uploading...' : 'Submit for Verification'}
          </button>

          <p style={{ fontSize: '0.8125rem', color: '#888', textAlign: 'center', marginTop: '0.75rem' }}>
            🔒 Your documents are securely stored and only reviewed by Drive Connect staff.
          </p>
        </div>
      )}

      {/* Info Box */}
      <div style={{ marginTop: '1.5rem', padding: '1.25rem', backgroundColor: '#F5F5F5', borderRadius: '8px' }}>
        <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.75rem' }}>Why do we need this?</h3>
        <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.875rem', color: '#555', lineHeight: 1.8 }}>
          <li>Verification protects both renters and vehicle owners</li>
          <li>Required by our insurance partners</li>
          <li>Typically reviewed within 24 hours</li>
          <li>You must be verified to complete a booking</li>
        </ul>
      </div>
    </div>
  );
}
