import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentHost } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const host = await getCurrentHost();
    if (!host) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("bookingId");

    if (bookingId) {
      // Get messages for a specific booking thread
      const booking = await prisma.booking.findFirst({
        where: { id: parseInt(bookingId), hostId: host.id },
      });

      if (!booking) {
        return NextResponse.json({ error: "Booking not found." }, { status: 404 });
      }

      const messages = await prisma.message.findMany({
        where: { bookingId: parseInt(bookingId), hostId: host.id },
        orderBy: { createdAt: "asc" },
      });

      // Mark host messages as read
      await prisma.message.updateMany({
        where: {
          bookingId: parseInt(bookingId),
          hostId: host.id,
          senderType: "renter",
          isRead: false,
        },
        data: { isRead: true },
      });

      return NextResponse.json({ messages });
    }

    // Get all conversations (grouped by booking/renter)
    const conversations = await prisma.booking.findMany({
      where: {
        hostId: host.id,
        messages: { some: {} },
      },
      include: {
        vehicle: { select: { year: true, make: true, model: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        _count: {
          select: {
            messages: {
              where: { senderType: "renter", isRead: false },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const conversationList = conversations.map((b) => ({
      bookingId: b.id,
      bookingReference: b.bookingReference,
      renterName: `${b.renterFirstName} ${b.renterLastName}`,
      renterEmail: b.renterEmail,
      vehicle: `${b.vehicle.year} ${b.vehicle.make} ${b.vehicle.model}`,
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
    console.error("Get messages error:", error);
    return NextResponse.json({ error: "Failed to fetch messages." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const host = await getCurrentHost();
    if (!host) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const { bookingId, content } = body;

    if (!bookingId || !content?.trim()) {
      return NextResponse.json({ error: "Booking ID and content required." }, { status: 400 });
    }

    const booking = await prisma.booking.findFirst({
      where: { id: parseInt(bookingId), hostId: host.id },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    const message = await prisma.message.create({
      data: {
        bookingId: parseInt(bookingId),
        hostId: host.id,
        renterEmail: booking.renterEmail,
        senderType: "host",
        content: content.trim(),
        isRead: false,
      },
    });

    return NextResponse.json({ success: true, message }, { status: 201 });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
