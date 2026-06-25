import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Phase 6D: AI-powered relevance scoring
function calculateRelevanceScore(vehicle: {
  rating: number | string;
  trips: number;
  hostCompletionRate?: number;
}): number {
  let score = 0;

  // Rating score (0-50 points)
  const rating = parseFloat(vehicle.rating.toString());
  score += rating * 10; // 0-50 points for 0-5 star rating

  // Trip count score (0-30 points) - more trips = more reliable
  const trips = vehicle.trips || 0;
  if (trips >= 50) score += 30;
  else if (trips >= 20) score += 20;
  else if (trips >= 10) score += 15;
  else if (trips >= 5) score += 10;
  else if (trips >= 1) score += 5;

  // Host completion rate bonus (0-20 points)
  if (vehicle.hostCompletionRate !== undefined) {
    score += vehicle.hostCompletionRate * 20;
  }

  return score;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const location = searchParams.get('location') || '';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const categories = searchParams.getAll('category');
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : null;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : null;
    const airportDelivery = searchParams.get('airportDelivery') === 'true';
    const homeDelivery = searchParams.get('homeDelivery') === 'true';
    const unlimitedMiles = searchParams.get('unlimitedMiles') === 'true';
    const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : null;
    const sortBy = searchParams.get('sortBy') || 'recommended';

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      status: 'active',
    };

    // Location filter (city or zip)
    if (location) {
      where.OR = [
        { city: { contains: location } },
        { zipCode: { contains: location } },
      ];
    }

    // Category filter
    if (categories.length > 0) {
      where.category = { in: categories };
    }

    // Price range
    if (minPrice !== null || maxPrice !== null) {
      where.dailyRate = {};
      if (minPrice !== null) where.dailyRate.gte = minPrice;
      if (maxPrice !== null) where.dailyRate.lte = maxPrice;
    }

    // Delivery options
    if (airportDelivery) where.offersAirportPickup = true;
    if (homeDelivery) where.offersHomeDelivery = true;
    if (unlimitedMiles) where.unlimitedMiles = true;

    // Rating filter
    if (minRating !== null) {
      where.rating = { gte: minRating };
    }

    // Date availability check - exclude vehicles with overlapping bookings
    if (startDate && endDate) {
      where.bookings = {
        none: {
          AND: [
            { status: { notIn: ['cancelled'] } },
            { startDate: { lte: new Date(endDate) } },
            { endDate: { gte: new Date(startDate) } },
          ],
        },
      };
    }

    const vehicles = await prisma.vehicle.findMany({
      where,
      include: {
        host: {
          select: {
            id: true,
            businessName: true,
            ownerName: true,
            description: true,
            logoUrl: true,
            bookings: {
              select: { status: true },
              take: 100,
            },
          },
        },
      },
    });

    // Phase 6D: Calculate relevance scores for all vehicles
    const vehiclesWithScores = vehicles.map(v => {
      const hostBookings = v.host.bookings || [];
      const completedBookings = hostBookings.filter(b => b.status === 'completed').length;
      const hostCompletionRate = hostBookings.length > 0 ? completedBookings / hostBookings.length : 0;
      
      const relevanceScore = calculateRelevanceScore({
      rating: parseFloat(v.rating.toString()),
      trips: v.trips,
      hostCompletionRate,
      });

      return {
        ...v,
        relevanceScore,
        photos: (() => {
          try { return JSON.parse(v.photos || '[]'); } catch { return []; }
        })(),
        dailyRate: parseFloat(v.dailyRate.toString()),
        weeklyRate: v.weeklyRate ? parseFloat(v.weeklyRate.toString()) : null,
        monthlyRate: v.monthlyRate ? parseFloat(v.monthlyRate.toString()) : null,
        securityDeposit: v.securityDeposit ? parseFloat(v.securityDeposit.toString()) : null,
        deliveryFee: v.deliveryFee ? parseFloat(v.deliveryFee.toString()) : null,
        rating: parseFloat(v.rating.toString()),
        host: {
          id: v.host.id,
          businessName: v.host.businessName,
          ownerName: v.host.ownerName,
          description: v.host.description,
          logoUrl: v.host.logoUrl,
        },
      };
    });

    // Sort based on sortBy parameter
    let sortedVehicles = [...vehiclesWithScores];
    switch (sortBy) {
      case 'recommended':
      case 'relevance':
        // Phase 6D: AI relevance scoring - combines rating, trips, and host performance
        sortedVehicles.sort((a, b) => b.relevanceScore - a.relevanceScore);
        break;
      case 'price_asc':
        sortedVehicles.sort((a, b) => a.dailyRate - b.dailyRate);
        break;
      case 'price_desc':
        sortedVehicles.sort((a, b) => b.dailyRate - a.dailyRate);
        break;
      case 'rating':
        sortedVehicles.sort((a, b) => b.rating - a.rating);
        break;
      case 'trips':
        sortedVehicles.sort((a, b) => b.trips - a.trips);
        break;
      default:
        sortedVehicles.sort((a, b) => b.relevanceScore - a.relevanceScore);
    }

    return NextResponse.json({
      success: true,
      count: sortedVehicles.length,
      vehicles: sortedVehicles,
    });
  } catch (error) {
    console.error('Vehicle search error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search vehicles' },
      { status: 500 }
    );
  }
}
