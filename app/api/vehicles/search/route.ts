import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    // Sort order
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let orderBy: any = { trips: 'desc' }; // recommended = most popular
    if (sortBy === 'price_asc') orderBy = { dailyRate: 'asc' };
    else if (sortBy === 'price_desc') orderBy = { dailyRate: 'desc' };
    else if (sortBy === 'rating') orderBy = { rating: 'desc' };
    else if (sortBy === 'trips') orderBy = { trips: 'desc' };

    const vehicles = await prisma.vehicle.findMany({
      where,
      orderBy,
      include: {
        host: {
          select: {
            id: true,
            businessName: true,
            ownerName: true,
            description: true,
            logoUrl: true,
          },
        },
      },
    });

    // Parse photos JSON
    const results = vehicles.map((v) => ({
      ...v,
      photos: (() => {
        try {
          return JSON.parse(v.photos || '[]');
        } catch {
          return [];
        }
      })(),
      dailyRate: parseFloat(v.dailyRate.toString()),
      weeklyRate: v.weeklyRate ? parseFloat(v.weeklyRate.toString()) : null,
      monthlyRate: v.monthlyRate ? parseFloat(v.monthlyRate.toString()) : null,
      securityDeposit: v.securityDeposit ? parseFloat(v.securityDeposit.toString()) : null,
      deliveryFee: v.deliveryFee ? parseFloat(v.deliveryFee.toString()) : null,
      rating: parseFloat(v.rating.toString()),
    }));

    return NextResponse.json({
      success: true,
      count: results.length,
      vehicles: results,
    });
  } catch (error) {
    console.error('Vehicle search error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search vehicles' },
      { status: 500 }
    );
  }
}
