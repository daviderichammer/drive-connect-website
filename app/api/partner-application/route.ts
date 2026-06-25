import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      businessName,
      ownerName,
      email,
      phone,
      primaryCity,
      additionalCities,
      numberOfVehicles,
      vehicleTypes,
      currentPlatforms,
      turoProfileUrl,
      offersAirportDelivery,
      offersHomeDelivery,
      hasCommercialInsurance,
      supportsSameDayBookings,
      operates24x7,
      wouldUseDCSupport,
    } = body;

    if (!businessName || !ownerName || !email || !phone || !primaryCity) {
      return NextResponse.json(
        { error: "Required fields are missing." },
        { status: 400 }
      );
    }

    const application = await prisma.partnerApplication.create({
      data: {
        businessName,
        ownerName,
        email,
        phone,
        primaryCity,
        additionalCities: additionalCities || null,
        numberOfVehicles: numberOfVehicles || 0,
        vehicleTypes: vehicleTypes || "",
        currentPlatforms: currentPlatforms || "",
        turoProfileUrl: turoProfileUrl || null,
        offersAirportDelivery: offersAirportDelivery || false,
        offersHomeDelivery: offersHomeDelivery || false,
        hasCommercialInsurance: hasCommercialInsurance || false,
        supportsSameDayBookings: supportsSameDayBookings || false,
        operates24x7: operates24x7 || false,
        wouldUseDCSupport: wouldUseDCSupport || false,
        status: "pending",
      },
    });

    return NextResponse.json({ success: true, id: application.id }, { status: 201 });
  } catch (error) {
    console.error("Partner application error:", error);
    return NextResponse.json(
      { error: "Failed to save application. Please try again." },
      { status: 500 }
    );
  }
}
