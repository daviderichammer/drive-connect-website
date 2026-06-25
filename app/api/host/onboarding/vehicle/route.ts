import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      year, make, model, trim, color, licensePlate, vin,
      mileage, fuelType, transmission, seats,
      dailyRate, weeklyRate, monthlyRate, securityDeposit, mileageIncluded,
      description, features,
      offersAirportDelivery, offersHomeDelivery, smokingAllowed, petsAllowed,
    } = body;

    if (!year || !make || !model || !dailyRate) {
      return NextResponse.json({ error: "Year, make, model, and daily rate are required." }, { status: 400 });
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        hostId: session.host.id,
        year: parseInt(year),
        make,
        model,
        trim: trim || null,
        color: color || null,
        licensePlate: licensePlate || null,
        vin: vin || null,
        mileage: mileage ? parseInt(mileage) : null,
        fuelType: fuelType || null,
        transmission: transmission || null,
        seats: seats ? parseInt(seats) : null,
        dailyRate: parseFloat(dailyRate),
        weeklyRate: weeklyRate ? parseFloat(weeklyRate) : null,
        monthlyRate: monthlyRate ? parseFloat(monthlyRate) : null,
        securityDeposit: securityDeposit ? parseFloat(securityDeposit) : null,
        mileageIncluded: mileageIncluded ? parseInt(mileageIncluded) : null,
        description: description || null,
        features: features ? JSON.stringify(features) : null,
        offersAirportDelivery: offersAirportDelivery || false,
        offersHomeDelivery: offersHomeDelivery || false,
        smokingAllowed: smokingAllowed || false,
        petsAllowed: petsAllowed || false,
        status: "active",
      },
    });

    await prisma.hostAccount.update({
      where: { id: session.host.id },
      data: { onboardingStep: Math.max(session.host.onboardingStep, 3) },
    });

    return NextResponse.json({ success: true, vehicle });
  } catch (error) {
    console.error("Vehicle creation error:", error);
    return NextResponse.json({ error: "Failed to create vehicle listing." }, { status: 500 });
  }
}
