import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentRenter } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const renter = await getCurrentRenter();
    if (!renter) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { renterId: renter.id },
      include: {
        vehicle: {
          include: {
            host: { select: { businessName: true, ownerName: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const favoriteList = favorites.map((f) => ({
      favoriteId: f.id,
      vehicleId: f.vehicleId,
      savedAt: f.createdAt,
      vehicle: {
        id: f.vehicle.id,
        year: f.vehicle.year,
        make: f.vehicle.make,
        model: f.vehicle.model,
        trim: f.vehicle.trim,
        dailyRate: Number(f.vehicle.dailyRate),
        photos: f.vehicle.photos,
        city: f.vehicle.city,
        rating: Number(f.vehicle.rating),
        trips: f.vehicle.trips,
        offersAirportPickup: f.vehicle.offersAirportPickup,
        offersHomeDelivery: f.vehicle.offersHomeDelivery,
        unlimitedMiles: f.vehicle.unlimitedMiles,
        category: f.vehicle.category,
        host: f.vehicle.host,
        status: f.vehicle.status,
      },
    }));

    return NextResponse.json({ favorites: favoriteList });
  } catch (error) {
    console.error("Get favorites error:", error);
    return NextResponse.json({ error: "Failed to fetch favorites." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const renter = await getCurrentRenter();
    if (!renter) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { vehicleId } = await req.json();

    if (!vehicleId) {
      return NextResponse.json({ error: "Vehicle ID required." }, { status: 400 });
    }

    // Check vehicle exists
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found." }, { status: 404 });
    }

    // Upsert favorite
    const favorite = await prisma.favorite.upsert({
      where: { renterId_vehicleId: { renterId: renter.id, vehicleId } },
      create: { renterId: renter.id, vehicleId },
      update: {},
    });

    return NextResponse.json({ success: true, favorite }, { status: 201 });
  } catch (error) {
    console.error("Add favorite error:", error);
    return NextResponse.json({ error: "Failed to save favorite." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const renter = await getCurrentRenter();
    if (!renter) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const vehicleId = searchParams.get("vehicleId");

    if (!vehicleId) {
      return NextResponse.json({ error: "Vehicle ID required." }, { status: 400 });
    }

    await prisma.favorite.deleteMany({
      where: { renterId: renter.id, vehicleId: parseInt(vehicleId) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Remove favorite error:", error);
    return NextResponse.json({ error: "Failed to remove favorite." }, { status: 500 });
  }
}
