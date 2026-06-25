import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateFullPricing } from '@/lib/pricing';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      vehicleId,
      startDate,
      endDate,
      protectionPlan,
      insuranceTier,
      deliveryOption,
    } = body;

    if (!vehicleId || !startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: 'vehicleId, startDate, and endDate are required' },
        { status: 400 }
      );
    }

    // Fetch vehicle
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: parseInt(vehicleId) },
      select: {
        dailyRate: true,
        deliveryFee: true,
        status: true,
      },
    });

    if (!vehicle) {
      return NextResponse.json({ success: false, error: 'Vehicle not found' }, { status: 404 });
    }

    if (vehicle.status !== 'active') {
      return NextResponse.json({ success: false, error: 'Vehicle is not available' }, { status: 400 });
    }

    const pricing = calculateFullPricing({
      dailyRate: parseFloat(vehicle.dailyRate.toString()),
      startDate,
      endDate,
      protectionPlan,
      insuranceTier,
      deliveryOption,
      deliveryFee: vehicle.deliveryFee ? parseFloat(vehicle.deliveryFee.toString()) : 0,
    });

    return NextResponse.json({ success: true, pricing });
  } catch (error) {
    console.error('Pricing calculation error:', error);
    return NextResponse.json({ success: false, error: 'Failed to calculate pricing' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vehicleId = searchParams.get('vehicleId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const protectionPlan = searchParams.get('protectionPlan') || 'standard';
    const insuranceTier = searchParams.get('insuranceTier') || 'standard';
    const deliveryOption = searchParams.get('deliveryOption') || 'pickup';

    if (!vehicleId || !startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: 'vehicleId, startDate, and endDate are required' },
        { status: 400 }
      );
    }

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: parseInt(vehicleId) },
      select: {
        dailyRate: true,
        deliveryFee: true,
        status: true,
      },
    });

    if (!vehicle) {
      return NextResponse.json({ success: false, error: 'Vehicle not found' }, { status: 404 });
    }

    const pricing = calculateFullPricing({
      dailyRate: parseFloat(vehicle.dailyRate.toString()),
      startDate,
      endDate,
      protectionPlan,
      insuranceTier,
      deliveryOption,
      deliveryFee: vehicle.deliveryFee ? parseFloat(vehicle.deliveryFee.toString()) : 0,
    });

    return NextResponse.json({ success: true, pricing });
  } catch (error) {
    console.error('Pricing GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to calculate pricing' }, { status: 500 });
  }
}
