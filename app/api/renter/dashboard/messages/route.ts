import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentRenter } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const renter = await getCurrentRenter();
    if (!renter) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("bookingId");

    if (bookingId) {
      // Get messages for a specific booking thread
      const booking = await prisma.booking.findFirst({
        where: { id: parseInt(bookingId), renterEmail: renter.email },
        include: {
          vehicle: { select: { year: true, make: true, model: true } },
          host: { select: { businessName: true, ownerName: true } },
        },
      });

      if (!booking) {
        return NextResponse.json({ error: "Booking not found." }, { status: 404 });
      }

      const messages = await prisma.message.findMany({
        where: { bookingId: parseInt(bookingId), renterEmail: renter.email },
        orderBy: { createdAt: "asc" },
      });

      // Mark host messages as read
      await prisma.message.updateMany({
        where: {
          bookingId: parseInt(bookingId),
          renterEmail: renter.email,
          senderType: "host",
          isRead: false,
        },
        data: { isRead: true },
      });

      return NextResponse.json({
        messages,
        booking: {
          id: booking.id,
          bookingReference: booking.bookingReference,
          vehicle: booking.vehicle,
          host: booking.host,
          status: booking.status,
        },
      });
    }

    // Get all conversations (grouped by booking)
    const conversations = await prisma.booking.findMany({
      where: {
        renterEmail: renter.email,
        messages: { some: {} },
      },
      include: {
        vehicle: { select: { year: true, make: true, model: true } },
        host: { select: { businessName: true, ownerName: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        _count: {
          select: {
            messages: {
              where: { senderType: "host", isRead: false },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const conversationList = conversations.map((b) => ({
      bookingId: b.id,
      bookingReference: b.bookingReference,
      vehicle: `${b.vehicle.year} ${b.vehicle.make} ${b.vehicle.model}`,
      hostName: b.host.businessName || b.host.ownerName,
      lastMessage: b.messages[0]
        ? {
            content: b.messages[0].content,
            senderType: b.messages[0].senderType,
            createdAt: b.messages[0].createdAt,
          }
        : null,
      unreadCount: b._count.messages,
      bookingStatus: b.status,
    }));

    return NextResponse.json({ conversations: conversationList });
  } catch (error) {
    console.error("Get renter messages error:", error);
    return NextResponse.json({ error: "Failed to fetch messages." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const renter = await getCurrentRenter();
    if (!renter) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { bookingId, content } = await req.json();

    if (!bookingId || !content?.trim()) {
      return NextResponse.json({ error: "Booking ID and content required." }, { status: 400 });
    }

    const booking = await prisma.booking.findFirst({
      where: { id: parseInt(bookingId), renterEmail: renter.email },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    const message = await prisma.message.create({
      data: {
        bookingId: parseInt(bookingId),
        hostId: booking.hostId,
        renterEmail: renter.email,
        senderType: "renter",
        content: content.trim(),
        isRead: false,
      },
    });

    return NextResponse.json({ success: true, message }, { status: 201 });
  } catch (error) {
    console.error("Send renter message error:", error);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
