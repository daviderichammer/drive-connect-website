import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentHost } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const host = await getCurrentHost();
  if (!host) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { year, make, model, trim, color, dailyRate, weeklyRate, monthlyRate, securityDeposit,
            seats, fuelType, transmission, mileageIncluded, description,
            hasGPS, hasBluetooth, hasCarPlay, offersAirportPickup, offersHomeDelivery } = body;

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
        offersAirportPickup: offersAirportPickup || false,
        offersHomeDelivery: offersHomeDelivery || false,
        description: description || null,
        status: "active",
      },
    });

    await prisma.hostAccount.update({
      where: { id: host.id },
      data: { onboardingStep: Math.max(host.onboardingStep, 3) },
    });

    return NextResponse.json({ success: true, vehicle });
  } catch (error) {
    console.error("Vehicle save error:", error);
    return NextResponse.json({ error: "Failed to save vehicle." }, { status: 500 });
  }
}
