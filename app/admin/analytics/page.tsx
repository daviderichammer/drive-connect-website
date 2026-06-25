'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface RevenueDataPoint {
  date: string;
  revenue: number;
  platformFee: number;
  bookings: number;
}

interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
}

interface FunnelData {
  stages: FunnelStage[];
  conversionRate: number;
  cancellationRate: number;
}

interface PopularVehicle {
  id: number;
  name: string;
  category: string;
  dailyRate: number;
  trips: number;
  rating: number;
  city: string | null;
  hostName: string;
  totalRevenue: number;
}

interface HostPerformance {
  id: number;
  businessName: string;
  ownerName: string;
  city: string | null;
  activeVehicles: number;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  completionRate: number;
  totalRevenue: number;
  totalPayout: number;
  avgRating: number;
}

interface SummaryStats {
  totalBookings: number;
  recentBookings: number;
  totalRevenue: number;
  allTimeRevenue: number;
  totalVehicles: number;
  activeVehicles: number;
  totalHosts: number;
  pendingVerifications: number;
}

interface Analytics {
  revenue: RevenueDataPoint[];
  funnel: FunnelData;
  popularVehicles: PopularVehicle[];
  hostPerformance: HostPerformance[];
  summary: SummaryStats;
}

function SimpleBarChart({ data, maxValue, color = '#DC2626' }: {
  data: { label: string; value: number }[];
  maxValue: number;
  color?: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {data.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '80px', fontSize: '0.75rem', color: '#666', textAlign: 'right', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item.label}
          </div>
          <div style={{ flex: 1, backgroundColor: '#f3f4f6', borderRadius: '4px', height: '20px', overflow: 'hidden' }}>
            <div style={{
              width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
              height: '100%',
              backgroundColor: color,
              borderRadius: '4px',
              transition: 'width 0.5s ease',
              minWidth: item.value > 0 ? '4px' : '0',
            }} />
          </div>
          <div style={{ width: '70px', fontSize: '0.75rem', fontWeight: 700, color: '#333', flexShrink: 0 }}>
            ${item.value.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}

function FunnelChart({ stages }: { stages: FunnelStage[] }) {
  const maxCount = stages[0]?.count || 1;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {stages.map((stage, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '160px', fontSize: '0.8125rem', color: '#555', flexShrink: 0 }}>{stage.stage}</div>
          <div style={{ flex: 1, backgroundColor: '#f3f4f6', borderRadius: '4px', height: '24px', overflow: 'hidden' }}>
            <div style={{
              width: `${(stage.count / maxCount) * 100}%`,
              height: '100%',
              backgroundColor: i === 0 ? '#000' : i === stages.length - 1 ? '#DC2626' : `hsl(${220 - i * 25}, 70%, 50%)`,
              borderRadius: '4px',
              transition: 'width 0.5s ease',
              minWidth: stage.count > 0 ? '4px' : '0',
            }} />
          </div>
          <div style={{ width: '100px', fontSize: '0.8125rem', fontWeight: 700, color: '#333', flexShrink: 0, textAlign: 'right' }}>
            {stage.count.toLocaleString()} ({stage.percentage}%)
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('monthly');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?period=${period}`, {
        headers: { 'x-admin-auth': 'admin_authenticated' },
      });
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      if (data.success) setAnalytics(data.analytics);
    } catch {
      console.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  const statCardStyle = {
    backgroundColor: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    padding: '1.25rem',
  };

  const sectionStyle = {
    backgroundColor: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid #e5e7eb', borderTopColor: '#DC2626', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: '#666' }}>Loading analytics...</p>
        </div>
      </div>
    );
  }

  const summary = analytics?.summary;
  const revenue = analytics?.revenue || [];
  const funnel = analytics?.funnel;
  const popularVehicles = analytics?.popularVehicles || [];
  const hostPerformance = analytics?.hostPerformance || [];

  const maxRevenue = Math.max(...revenue.map(r => r.revenue), 1);
  const revenueChartData = revenue.slice(-12).map(r => ({
    label: r.date.length === 7 ? r.date.slice(5) : r.date.slice(5),
    value: r.revenue,
  }));

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Link href="/admin/dashboard" style={{ color: '#DC2626', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
            ← Back to Dashboard
          </Link>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, marginTop: '0.5rem' }}>Analytics Dashboard</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['daily', 'weekly', 'monthly'].map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: period === p ? '#DC2626' : '#e5e7eb',
              color: period === p ? '#fff' : '#333',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid #e5e7eb', marginBottom: '1.5rem', overflowX: 'auto' }}>
        {[
          { id: 'overview', label: '📊 Overview' },
          { id: 'revenue', label: '💰 Revenue' },
          { id: 'funnel', label: '🔽 Conversion Funnel' },
          { id: 'vehicles', label: '🚗 Popular Vehicles' },
          { id: 'hosts', label: '👤 Host Performance' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding: '0.75rem 1.25rem',
            border: 'none',
            borderBottom: activeTab === tab.id ? '2px solid #DC2626' : '2px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === tab.id ? '#DC2626' : '#666',
            fontWeight: activeTab === tab.id ? 700 : 500,
            fontSize: '0.875rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            marginBottom: '-2px',
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && summary && (
        <div>
          {/* Summary Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'Revenue (30 days)', value: `$${summary.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, color: '#DC2626', icon: '💰' },
              { label: 'All-Time Revenue', value: `$${summary.allTimeRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, color: '#000', icon: '📈' },
              { label: 'Bookings (30 days)', value: summary.recentBookings.toString(), color: '#2563eb', icon: '📋' },
              { label: 'Total Bookings', value: summary.totalBookings.toString(), color: '#7c3aed', icon: '📊' },
              { label: 'Active Vehicles', value: `${summary.activeVehicles} / ${summary.totalVehicles}`, color: '#059669', icon: '🚗' },
              { label: 'Active Hosts', value: summary.totalHosts.toString(), color: '#d97706', icon: '👤' },
              { label: 'Pending Verifications', value: summary.pendingVerifications.toString(), color: summary.pendingVerifications > 0 ? '#DC2626' : '#059669', icon: '🔍' },
            ].map((stat, i) => (
              <div key={i} style={statCardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>{stat.icon}</span>
                  <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</span>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: stat.color }}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Quick Revenue Chart */}
          {revenueChartData.length > 0 && (
            <div style={sectionStyle}>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Revenue Trend ({period})
              </h2>
              <SimpleBarChart data={revenueChartData} maxValue={maxRevenue} />
            </div>
          )}

          {/* Quick Funnel */}
          {funnel && (
            <div style={sectionStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Booking Conversion Funnel (30 days)
                </h2>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
                  <span style={{ color: '#16a34a', fontWeight: 700 }}>Conversion: {funnel.conversionRate}%</span>
                  <span style={{ color: '#DC2626', fontWeight: 700 }}>Cancellation: {funnel.cancellationRate}%</span>
                </div>
              </div>
              <FunnelChart stages={funnel.stages} />
            </div>
          )}
        </div>
      )}

      {/* Revenue Tab */}
      {activeTab === 'revenue' && (
        <div>
          <div style={sectionStyle}>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Revenue by {period.charAt(0).toUpperCase() + period.slice(1)} Period
            </h2>
            {revenue.length === 0 ? (
              <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>No revenue data available yet.</p>
            ) : (
              <>
                <SimpleBarChart data={revenueChartData} maxValue={maxRevenue} />
                <div style={{ marginTop: '1.5rem', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                        {['Period', 'Gross Revenue', 'Platform Fee (15%)', 'Host Payouts', 'Bookings'].map(h => (
                          <th key={h} style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 700, color: '#333', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {revenue.slice().reverse().slice(0, 20).map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '0.75rem', fontWeight: 600 }}>{row.date}</td>
                          <td style={{ padding: '0.75rem', color: '#DC2626', fontWeight: 700 }}>${row.revenue.toFixed(2)}</td>
                          <td style={{ padding: '0.75rem', color: '#666' }}>${row.platformFee.toFixed(2)}</td>
                          <td style={{ padding: '0.75rem' }}>${(row.revenue - row.platformFee).toFixed(2)}</td>
                          <td style={{ padding: '0.75rem' }}>{row.bookings}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr style={{ borderTop: '2px solid #000', backgroundColor: '#f9fafb' }}>
                        <td style={{ padding: '0.75rem', fontWeight: 800 }}>Total</td>
                        <td style={{ padding: '0.75rem', fontWeight: 800, color: '#DC2626' }}>
                          ${revenue.reduce((s, r) => s + r.revenue, 0).toFixed(2)}
                        </td>
                        <td style={{ padding: '0.75rem', fontWeight: 800 }}>
                          ${revenue.reduce((s, r) => s + r.platformFee, 0).toFixed(2)}
                        </td>
                        <td style={{ padding: '0.75rem', fontWeight: 800 }}>
                          ${revenue.reduce((s, r) => s + r.revenue - r.platformFee, 0).toFixed(2)}
                        </td>
                        <td style={{ padding: '0.75rem', fontWeight: 800 }}>
                          {revenue.reduce((s, r) => s + r.bookings, 0)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Funnel Tab */}
      {activeTab === 'funnel' && funnel && (
        <div>
          <div style={sectionStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Booking Conversion Funnel
              </h2>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#16a34a' }}>{funnel.conversionRate}%</div>
                  <div style={{ fontSize: '0.75rem', color: '#666' }}>Conversion Rate</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#DC2626' }}>{funnel.cancellationRate}%</div>
                  <div style={{ fontSize: '0.75rem', color: '#666' }}>Cancellation Rate</div>
                </div>
              </div>
            </div>
            <FunnelChart stages={funnel.stages} />
            <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {funnel.stages.map((stage, i) => (
                <div key={i} style={{ ...statCardStyle, textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#DC2626' }}>{stage.count.toLocaleString()}</div>
                  <div style={{ fontSize: '0.8125rem', color: '#666', marginTop: '0.25rem' }}>{stage.stage}</div>
                  <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.125rem' }}>{stage.percentage}% of total</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Popular Vehicles Tab */}
      {activeTab === 'vehicles' && (
        <div style={sectionStyle}>
          <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Top Performing Vehicles
          </h2>
          {popularVehicles.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>No vehicle data available.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    {['Rank', 'Vehicle', 'Category', 'Host', 'City', 'Daily Rate', 'Trips', 'Rating', 'Total Revenue'].map(h => (
                      <th key={h} style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 700, color: '#333', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {popularVehicles.map((v, i) => (
                    <tr key={v.id} style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: i === 0 ? '#fff5f5' : 'transparent' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 700, color: i === 0 ? '#DC2626' : '#666' }}>
                        {i === 0 ? '🏆' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                      </td>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>{v.name}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ backgroundColor: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                          {v.category}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', color: '#666' }}>{v.hostName}</td>
                      <td style={{ padding: '0.75rem', color: '#666' }}>{v.city || '—'}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 700 }}>${v.dailyRate}/day</td>
                      <td style={{ padding: '0.75rem' }}>{v.trips}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ color: '#d97706', fontWeight: 700 }}>★ {v.rating.toFixed(1)}</span>
                      </td>
                      <td style={{ padding: '0.75rem', fontWeight: 700, color: '#DC2626' }}>${v.totalRevenue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Host Performance Tab */}
      {activeTab === 'hosts' && (
        <div style={sectionStyle}>
          <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Host Performance Metrics
          </h2>
          {hostPerformance.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>No host data available.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    {['Host', 'City', 'Vehicles', 'Bookings', 'Completed', 'Completion %', 'Avg Rating', 'Total Revenue', 'Host Payout'].map(h => (
                      <th key={h} style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 700, color: '#333', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {hostPerformance.map((host, i) => (
                    <tr key={host.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ fontWeight: 700 }}>{host.businessName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#888' }}>{host.ownerName}</div>
                      </td>
                      <td style={{ padding: '0.75rem', color: '#666' }}>{host.city || '—'}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>{host.activeVehicles}</td>
                      <td style={{ padding: '0.75rem' }}>{host.totalBookings}</td>
                      <td style={{ padding: '0.75rem', color: '#16a34a', fontWeight: 600 }}>{host.completedBookings}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ flex: 1, height: '6px', backgroundColor: '#f3f4f6', borderRadius: '3px', overflow: 'hidden', minWidth: '60px' }}>
                            <div style={{ width: `${host.completionRate}%`, height: '100%', backgroundColor: host.completionRate >= 80 ? '#16a34a' : host.completionRate >= 60 ? '#d97706' : '#DC2626', borderRadius: '3px' }} />
                          </div>
                          <span style={{ fontWeight: 700, fontSize: '0.8125rem' }}>{host.completionRate}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ color: '#d97706', fontWeight: 700 }}>★ {host.avgRating.toFixed(1)}</span>
                      </td>
                      <td style={{ padding: '0.75rem', fontWeight: 700, color: '#DC2626' }}>${host.totalRevenue.toFixed(2)}</td>
                      <td style={{ padding: '0.75rem', color: '#16a34a', fontWeight: 600 }}>${host.totalPayout.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
