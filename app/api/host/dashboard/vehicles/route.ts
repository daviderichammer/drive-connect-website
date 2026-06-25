import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentHost } from "@/lib/auth";

export async function GET() {
  try {
    const host = await getCurrentHost();
    if (!host) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const vehicles = await prisma.vehicle.findMany({
      where: { hostId: host.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { bookings: true } },
        bookings: {
          where: { status: { notIn: ["cancelled"] } },
          select: { totalPrice: true, status: true },
        },
      },
    });

    const vehiclesWithStats = vehicles.map((v) => {
      const revenue = v.bookings.reduce(
        (sum, b) => sum + parseFloat(b.totalPrice.toString()),
        0
      );
      const activeBookings = v.bookings.filter(
        (b) => b.status === "active" || b.status === "confirmed"
      ).length;

      return {
        id: v.id,
        year: v.year,
        make: v.make,
        model: v.model,
        trim: v.trim,
        color: v.color,
        licensePlate: v.licensePlate,
        vin: v.vin,
        mileage: v.mileage,
        seats: v.seats,
        fuelType: v.fuelType,
        transmission: v.transmission,
        dailyRate: parseFloat(v.dailyRate.toString()),
        weeklyRate: v.weeklyRate ? parseFloat(v.weeklyRate.toString()) : null,
        monthlyRate: v.monthlyRate ? parseFloat(v.monthlyRate.toString()) : null,
        securityDeposit: v.securityDeposit ? parseFloat(v.securityDeposit.toString()) : null,
        mileageIncluded: v.mileageIncluded,
        hasGPS: v.hasGPS,
        hasBluetooth: v.hasBluetooth,
        hasCarPlay: v.hasCarPlay,
        hasChargingCable: v.hasChargingCable,
        hasChildSeat: v.hasChildSeat,
        offersAirportPickup: v.offersAirportPickup,
        offersHomeDelivery: v.offersHomeDelivery,
        deliveryFee: v.deliveryFee ? parseFloat(v.deliveryFee.toString()) : null,
        description: v.description,
        vehicleRules: v.vehicleRules,
        pickupInstructions: v.pickupInstructions,
        status: v.status,
        photos: (() => {
          try { return JSON.parse(v.photos || "[]"); } catch { return []; }
        })(),
        category: v.category,
        city: v.city,
        zipCode: v.zipCode,
        rating: parseFloat(v.rating.toString()),
        trips: v.trips,
        unlimitedMiles: v.unlimitedMiles,
        totalBookings: v._count.bookings,
        totalRevenue: revenue,
        activeBookings,
        createdAt: v.createdAt,
      };
    });

    return NextResponse.json({ vehicles: vehiclesWithStats });
  } catch (error) {
    console.error("Get vehicles error:", error);
    return NextResponse.json({ error: "Failed to fetch vehicles." }, { status: 500 });
  }
}

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
      photos, category, city, zipCode, unlimitedMiles,
    } = body;

    if (!year || !make || !model || !dailyRate) {
      return NextResponse.json(
        { error: "Year, make, model, and daily rate are required." },
        { status: 400 }
      );
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
        photos: photos ? JSON.stringify(photos) : null,
        category: category || "Sedan",
        city: city || null,
        zipCode: zipCode || null,
        unlimitedMiles: unlimitedMiles || false,
        status: "active",
      },
    });

    return NextResponse.json({ success: true, vehicle }, { status: 201 });
  } catch (error) {
    console.error("Vehicle creation error:", error);
    return NextResponse.json({ error: "Failed to create vehicle." }, { status: 500 });
  }
}
