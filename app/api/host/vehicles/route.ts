import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentHost } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const host = await getCurrentHost();
    if (!host) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const {
      year, make, model, trim, color, licensePlate, vin, mileage,
      seats, fuelType, transmission,
      dailyRate, weeklyRate, monthlyRate, securityDeposit, mileageIncluded,
      hasGPS, hasBluetooth, hasCarPlay, hasChargingCable, hasChildSeat,
      offersAirportPickup, offersHomeDelivery, deliveryFee,
      description, vehicleRules, pickupInstructions,
    } = body;

    if (!year || !make || !model || !dailyRate) {
      return NextResponse.json({ error: "Year, make, model, and daily rate are required." }, { status: 400 });
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        hostId: host.id,
        year: parseInt(year),
        make,
        model,
        trim: trim || null,
        color: color || null,
        licensePlate: licensePlate || null,
        vin: vin || null,
        mileage: mileage ? parseInt(mileage) : null,
        seats: seats ? parseInt(seats) : 5,
        fuelType: fuelType || "Gasoline",
        transmission: transmission || "Automatic",
        dailyRate: parseFloat(dailyRate),
        weeklyRate: weeklyRate ? parseFloat(weeklyRate) : null,
        monthlyRate: monthlyRate ? parseFloat(monthlyRate) : null,
        securityDeposit: securityDeposit ? parseFloat(securityDeposit) : null,
        mileageIncluded: mileageIncluded ? parseInt(mileageIncluded) : null,
        hasGPS: hasGPS || false,
        hasBluetooth: hasBluetooth || false,
        hasCarPlay: hasCarPlay || false,
        hasChargingCable: hasChargingCable || false,
        hasChildSeat: hasChildSeat || false,
        offersAirportPickup: offersAirportPickup || false,
        offersHomeDelivery: offersHomeDelivery || false,
        deliveryFee: deliveryFee ? parseFloat(deliveryFee) : null,
        description: description || null,
        vehicleRules: vehicleRules || null,
        pickupInstructions: pickupInstructions || null,
        status: "active",
      },
    });

    // Update onboarding step
    await prisma.hostAccount.update({
      where: { id: host.id },
      data: {
        onboardingStep: Math.max(host.onboardingStep, 3),
      },
    });

    return NextResponse.json({ success: true, vehicle }, { status: 201 });
  } catch (error) {
    console.error("Vehicle creation error:", error);
    return NextResponse.json({ error: "Failed to create vehicle. Please try again." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const host = await getCurrentHost();
    if (!host) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const vehicles = await prisma.vehicle.findMany({
      where: { hostId: host.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ vehicles });
  } catch (error) {
    console.error("Get vehicles error:", error);
    return NextResponse.json({ error: "Failed to fetch vehicles." }, { status: 500 });
  }
}
