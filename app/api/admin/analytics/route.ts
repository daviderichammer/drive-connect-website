import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

function checkAdminAuth(request: NextRequest, cookieStore: ReturnType<typeof cookies> extends Promise<infer T> ? T : never): boolean {
  const adminToken = cookieStore.get('admin_session')?.value;
  const authHeader = request.headers.get('x-admin-auth');
  return adminToken === 'admin_authenticated' || authHeader === 'admin_authenticated';
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_session')?.value;
    const authHeader = request.headers.get('x-admin-auth');
    
    if (adminToken !== 'admin_authenticated' && authHeader !== 'admin_authenticated') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'monthly'; // daily, weekly, monthly
    const type = searchParams.get('type') || 'all'; // revenue, funnel, vehicles, hosts

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    // ─── Revenue Data ───────────────────────────────────────────────
    const revenueData = await getRevenueData(period, thirtyDaysAgo, ninetyDaysAgo);

    // ─── Booking Conversion Funnel ──────────────────────────────────
    const funnelData = await getFunnelData(thirtyDaysAgo);

    // ─── Popular Vehicles ───────────────────────────────────────────
    const popularVehicles = await getPopularVehicles();

    // ─── Host Performance ───────────────────────────────────────────
    const hostPerformance = await getHostPerformance();

    // ─── Summary Stats ──────────────────────────────────────────────
    const summaryStats = await getSummaryStats(thirtyDaysAgo);

    return NextResponse.json({
      success: true,
      analytics: {
        revenue: revenueData,
        funnel: funnelData,
        popularVehicles,
        hostPerformance,
        summary: summaryStats,
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch analytics' }, { status: 500 });
  }
}

async function getRevenueData(period: string, thirtyDaysAgo: Date, ninetyDaysAgo: Date) {
  const bookings = await prisma.booking.findMany({
    where: {
      createdAt: { gte: ninetyDaysAgo },
      paymentStatus: 'paid',
    },
    select: {
      totalPrice: true,
      platformFeeAmount: true,
      createdAt: true,
      status: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  // Group by day/week/month
  const grouped: Record<string, { revenue: number; platformFee: number; count: number }> = {};
  
  bookings.forEach(b => {
    let key: string;
    const date = new Date(b.createdAt);
    
    if (period === 'daily') {
      key = date.toISOString().split('T')[0];
    } else if (period === 'weekly') {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      key = weekStart.toISOString().split('T')[0];
    } else {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }

    if (!grouped[key]) {
      grouped[key] = { revenue: 0, platformFee: 0, count: 0 };
    }
    grouped[key].revenue += parseFloat(b.totalPrice?.toString() || '0');
    grouped[key].platformFee += parseFloat(b.platformFeeAmount?.toString() || '0');
    grouped[key].count++;
  });

  const chartData = Object.entries(grouped).map(([date, data]) => ({
    date,
    revenue: parseFloat(data.revenue.toFixed(2)),
    platformFee: parseFloat(data.platformFee.toFixed(2)),
    bookings: data.count,
  })).sort((a, b) => a.date.localeCompare(b.date));

  return chartData;
}

async function getFunnelData(thirtyDaysAgo: Date) {
  // Count total vehicle views (approximated by active vehicles * avg views)
  const totalVehicles = await prisma.vehicle.count({ where: { status: 'active' } });
  
  // Bookings in various states
  const allBookings = await prisma.booking.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    select: { status: true, paymentStatus: true },
  });

  const totalBookings = allBookings.length;
  const confirmedBookings = allBookings.filter(b => b.status === 'confirmed' || b.status === 'completed').length;
  const completedBookings = allBookings.filter(b => b.status === 'completed').length;
  const cancelledBookings = allBookings.filter(b => b.status === 'cancelled').length;
  const paidBookings = allBookings.filter(b => b.paymentStatus === 'paid').length;

  // Estimated funnel (vehicle views → checkout starts → payment → confirmed)
  const estimatedViews = totalVehicles * 45; // estimated monthly views
  const estimatedCheckoutStarts = Math.round(estimatedViews * 0.08);

  return {
    stages: [
      { stage: 'Vehicle Views (est.)', count: estimatedViews, percentage: 100 },
      { stage: 'Checkout Started', count: estimatedCheckoutStarts, percentage: 8 },
      { stage: 'Payment Initiated', count: totalBookings, percentage: parseFloat(((totalBookings / estimatedViews) * 100).toFixed(1)) },
      { stage: 'Payment Completed', count: paidBookings, percentage: parseFloat(((paidBookings / estimatedViews) * 100).toFixed(1)) },
      { stage: 'Booking Confirmed', count: confirmedBookings, percentage: parseFloat(((confirmedBookings / estimatedViews) * 100).toFixed(1)) },
      { stage: 'Trip Completed', count: completedBookings, percentage: parseFloat(((completedBookings / estimatedViews) * 100).toFixed(1)) },
    ],
    conversionRate: totalBookings > 0 ? parseFloat(((confirmedBookings / totalBookings) * 100).toFixed(1)) : 0,
    cancellationRate: totalBookings > 0 ? parseFloat(((cancelledBookings / totalBookings) * 100).toFixed(1)) : 0,
  };
}

async function getPopularVehicles() {
  const vehicles = await prisma.vehicle.findMany({
    where: { status: 'active' },
    select: {
      id: true,
      year: true,
      make: true,
      model: true,
      category: true,
      dailyRate: true,
      trips: true,
      rating: true,
      city: true,
      host: {
        select: { businessName: true },
      },
      bookings: {
        where: { paymentStatus: 'paid' },
        select: { totalPrice: true },
      },
    },
    orderBy: { trips: 'desc' },
    take: 10,
  });

  return vehicles.map(v => ({
    id: v.id,
    name: `${v.year} ${v.make} ${v.model}`,
    category: v.category,
    dailyRate: parseFloat(v.dailyRate.toString()),
    trips: v.trips,
    rating: parseFloat(v.rating.toString()),
    city: v.city,
    hostName: v.host.businessName,
    totalRevenue: parseFloat(
      v.bookings.reduce((sum, b) => sum + parseFloat(b.totalPrice?.toString() || '0'), 0).toFixed(2)
    ),
  }));
}

async function getHostPerformance() {
  const hosts = await prisma.hostAccount.findMany({
    where: { onboardingCompleted: true },
    select: {
      id: true,
      businessName: true,
      ownerName: true,
      primaryCity: true,
      vehicles: {
        select: {
          id: true,
          trips: true,
          rating: true,
          status: true,
        },
      },
      bookings: {
        select: {
          status: true,
          totalPrice: true,
          hostPayoutAmount: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
      },
    },
    take: 20,
  });

  return hosts.map(host => {
    const totalBookings = host.bookings.length;
    const completedBookings = host.bookings.filter(b => b.status === 'completed').length;
    const cancelledBookings = host.bookings.filter(b => b.status === 'cancelled').length;
    const totalRevenue = host.bookings
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, b) => sum + parseFloat(b.totalPrice?.toString() || '0'), 0);
    const totalPayout = host.bookings
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, b) => sum + parseFloat(b.hostPayoutAmount?.toString() || '0'), 0);
    const activeVehicles = host.vehicles.filter(v => v.status === 'active').length;
    const avgRating = host.vehicles.length > 0
      ? host.vehicles.reduce((sum, v) => sum + parseFloat(v.rating.toString()), 0) / host.vehicles.length
      : 0;
    const completionRate = totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0;

    return {
      id: host.id,
      businessName: host.businessName,
      ownerName: host.ownerName,
      city: host.primaryCity,
      activeVehicles,
      totalBookings,
      completedBookings,
      cancelledBookings,
      completionRate: parseFloat(completionRate.toFixed(1)),
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      totalPayout: parseFloat(totalPayout.toFixed(2)),
      avgRating: parseFloat(avgRating.toFixed(2)),
    };
  }).sort((a, b) => b.totalRevenue - a.totalRevenue);
}

async function getSummaryStats(thirtyDaysAgo: Date) {
  const [
    totalBookings,
    recentBookings,
    totalRevenue,
    recentRevenue,
    totalVehicles,
    activeVehicles,
    totalHosts,
    pendingVerifications,
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.booking.aggregate({
      _sum: { totalPrice: true },
      where: { paymentStatus: 'paid' },
    }),
    prisma.booking.aggregate({
      _sum: { totalPrice: true },
      where: { paymentStatus: 'paid', createdAt: { gte: thirtyDaysAgo } },
    }),
    prisma.vehicle.count(),
    prisma.vehicle.count({ where: { status: 'active' } }),
    prisma.hostAccount.count({ where: { onboardingCompleted: true } }),
    prisma.renterAccount.count({ where: { verificationStatus: 'pending' } }),
  ]);

  return {
    totalBookings,
    recentBookings,
    totalRevenue: parseFloat((recentRevenue._sum.totalPrice?.toString() || '0')),
    allTimeRevenue: parseFloat((totalRevenue._sum.totalPrice?.toString() || '0')),
    totalVehicles,
    activeVehicles,
    totalHosts,
    pendingVerifications,
  };
}
