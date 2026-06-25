import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentHost } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const host = await getCurrentHost();
    if (!host) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const vehicle = await prisma.vehicle.findFirst({
      where: { id: parseInt(id), hostId: host.id },
    });

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found." }, { status: 404 });
    }

    return NextResponse.json({
      vehicle: {
        ...vehicle,
        dailyRate: parseFloat(vehicle.dailyRate.toString()),
        weeklyRate: vehicle.weeklyRate ? parseFloat(vehicle.weeklyRate.toString()) : null,
        monthlyRate: vehicle.monthlyRate ? parseFloat(vehicle.monthlyRate.toString()) : null,
        securityDeposit: vehicle.securityDeposit ? parseFloat(vehicle.securityDeposit.toString()) : null,
        deliveryFee: vehicle.deliveryFee ? parseFloat(vehicle.deliveryFee.toString()) : null,
        rating: parseFloat(vehicle.rating.toString()),
        photos: (() => {
          try { return JSON.parse(vehicle.photos || "[]"); } catch { return []; }
        })(),
      },
    });
  } catch (error) {
    console.error("Get vehicle error:", error);
    return NextResponse.json({ error: "Failed to fetch vehicle." }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const host = await getCurrentHost();
    if (!host) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.vehicle.findFirst({
      where: { id: parseInt(id), hostId: host.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Vehicle not found." }, { status: 404 });
    }

    const body = await req.json();
    const {
      year, make, model, trim, color, licensePlate, vin, mileage,
      seats, fuelType, transmission,
      dailyRate, weeklyRate, monthlyRate, securityDeposit, mileageIncluded,
      hasGPS, hasBluetooth, hasCarPlay, hasChargingCable, hasChildSeat,
      offersAirportPickup, offersHomeDelivery, deliveryFee,
      description, vehicleRules, pickupInstructions,
      photos, category, city, zipCode, unlimitedMiles, status,
    } = body;

    const vehicle = await prisma.vehicle.update({
      where: { id: parseInt(id) },
      data: {
        year: year ? parseInt(year) : existing.year,
        make: make || existing.make,
        model: model || existing.model,
        trim: trim !== undefined ? trim : existing.trim,
        color: color !== undefined ? color : existing.color,
        licensePlate: licensePlate !== undefined ? licensePlate : existing.licensePlate,
        vin: vin !== undefined ? vin : existing.vin,
        mileage: mileage !== undefined ? (mileage ? parseInt(mileage) : null) : existing.mileage,
        seats: seats ? parseInt(seats) : existing.seats,
        fuelType: fuelType || existing.fuelType,
        transmission: transmission || existing.transmission,
        dailyRate: dailyRate ? parseFloat(dailyRate) : existing.dailyRate,
        weeklyRate: weeklyRate !== undefined ? (weeklyRate ? parseFloat(weeklyRate) : null) : existing.weeklyRate,
        monthlyRate: monthlyRate !== undefined ? (monthlyRate ? parseFloat(monthlyRate) : null) : existing.monthlyRate,
        securityDeposit: securityDeposit !== undefined ? (securityDeposit ? parseFloat(securityDeposit) : null) : existing.securityDeposit,
        mileageIncluded: mileageIncluded !== undefined ? (mileageIncluded ? parseInt(mileageIncluded) : null) : existing.mileageIncluded,
        hasGPS: hasGPS !== undefined ? hasGPS : existing.hasGPS,
        hasBluetooth: hasBluetooth !== undefined ? hasBluetooth : existing.hasBluetooth,
        hasCarPlay: hasCarPlay !== undefined ? hasCarPlay : existing.hasCarPlay,
        hasChargingCable: hasChargingCable !== undefined ? hasChargingCable : existing.hasChargingCable,
        hasChildSeat: hasChildSeat !== undefined ? hasChildSeat : existing.hasChildSeat,
        offersAirportPickup: offersAirportPickup !== undefined ? offersAirportPickup : existing.offersAirportPickup,
        offersHomeDelivery: offersHomeDelivery !== undefined ? offersHomeDelivery : existing.offersHomeDelivery,
        deliveryFee: deliveryFee !== undefined ? (deliveryFee ? parseFloat(deliveryFee) : null) : existing.deliveryFee,
        description: description !== undefined ? description : existing.description,
        vehicleRules: vehicleRules !== undefined ? vehicleRules : existing.vehicleRules,
        pickupInstructions: pickupInstructions !== undefined ? pickupInstructions : existing.pickupInstructions,
        photos: photos !== undefined ? JSON.stringify(photos) : existing.photos,
        category: category || existing.category,
        city: city !== undefined ? city : existing.city,
        zipCode: zipCode !== undefined ? zipCode : existing.zipCode,
        unlimitedMiles: unlimitedMiles !== undefined ? unlimitedMiles : existing.unlimitedMiles,
        status: status || existing.status,
      },
    });

    return NextResponse.json({ success: true, vehicle });
  } catch (error) {
    console.error("Update vehicle error:", error);
    return NextResponse.json({ error: "Failed to update vehicle." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const host = await getCurrentHost();
    if (!host) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.vehicle.findFirst({
      where: { id: parseInt(id), hostId: host.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Vehicle not found." }, { status: 404 });
    }

    // Check for active bookings
    const activeBookings = await prisma.booking.count({
      where: {
        vehicleId: parseInt(id),
        status: { in: ["confirmed", "active", "pending"] },
      },
    });

    if (activeBookings > 0) {
      return NextResponse.json(
        { error: "Cannot delete vehicle with active bookings. Deactivate it instead." },
        { status: 400 }
      );
    }

    await prisma.vehicle.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete vehicle error:", error);
    return NextResponse.json({ error: "Failed to delete vehicle." }, { status: 500 });
  }
}
