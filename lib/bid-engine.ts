// Drive Connect - Bid Engine
// Manages the operator bidding marketplace for booking opportunities

import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export interface BidSubmission {
  opportunityId: number;
  operatorId: number;
  bidPerDay: number;
  notes?: string;
}

export interface BidResult {
  success: boolean;
  bid?: {
    id: number;
    bidPerDay: number;
    bidTotal: number;
    estimatedMarginPerDay: number;
    estimatedMarginTotal: number;
    status: string;
  };
  error?: string;
}

export interface OpportunityWithDetails {
  id: number;
  opportunityReference: string;
  sippCode: { code: string; name: string; category: string };
  market: { marketName: string; marketCode: string };
  pickupLocation: string;
  dropoffLocation: string | null;
  pickupDate: Date;
  dropoffDate: Date;
  rentalDays: number;
  retailPricePerDay: number;
  retailPriceTotal: number;
  minimumBidPerDay: number;
  minimumBidTotal: number;
  biddingClosesAt: Date;
  status: string;
  autoAcceptLowest: boolean;
  priceBreakdown: string | null;
  myBid?: {
    id: number;
    bidPerDay: number;
    bidTotal: number;
    estimatedMarginPerDay: number;
    estimatedMarginTotal: number;
    status: string;
    submittedAt: Date;
  } | null;
}

export function generateOpportunityReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `OPP-${timestamp}-${random}`;
}

export function generateSettlementReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `SET-${timestamp}-${random}`;
}

export async function getAvailableOpportunities(operatorId: number): Promise<OpportunityWithDetails[]> {
  const now = new Date();

  const opportunities = await prisma.bookingOpportunity.findMany({
    where: {
      status: "open",
      biddingClosesAt: { gt: now },
    },
    include: {
      sippCode: { select: { code: true, name: true, category: true } },
      market: { select: { marketName: true, marketCode: true } },
      bids: {
        where: { operatorId },
        select: {
          id: true,
          bidPerDay: true,
          bidTotal: true,
          estimatedMarginPerDay: true,
          estimatedMarginTotal: true,
          status: true,
          submittedAt: true,
        },
      },
    },
    orderBy: { biddingClosesAt: "asc" },
  });

  return opportunities.map((opp) => ({
    id: opp.id,
    opportunityReference: opp.opportunityReference,
    sippCode: opp.sippCode,
    market: opp.market,
    pickupLocation: opp.pickupLocation,
    dropoffLocation: opp.dropoffLocation,
    pickupDate: opp.pickupDate,
    dropoffDate: opp.dropoffDate,
    rentalDays: opp.rentalDays,
    retailPricePerDay: Number(opp.retailPricePerDay),
    retailPriceTotal: Number(opp.retailPriceTotal),
    minimumBidPerDay: Number(opp.minimumBidPerDay),
    minimumBidTotal: Number(opp.minimumBidTotal),
    biddingClosesAt: opp.biddingClosesAt,
    status: opp.status,
    autoAcceptLowest: opp.autoAcceptLowest,
    priceBreakdown: opp.priceBreakdown,
    myBid: opp.bids.length > 0
      ? {
          id: opp.bids[0].id,
          bidPerDay: Number(opp.bids[0].bidPerDay),
          bidTotal: Number(opp.bids[0].bidTotal),
          estimatedMarginPerDay: Number(opp.bids[0].estimatedMarginPerDay),
          estimatedMarginTotal: Number(opp.bids[0].estimatedMarginTotal),
          status: opp.bids[0].status,
          submittedAt: opp.bids[0].submittedAt,
        }
      : null,
  }));
}

export async function submitBid(submission: BidSubmission): Promise<BidResult> {
  const { opportunityId, operatorId, bidPerDay, notes } = submission;

  // Fetch opportunity
  const opportunity = await prisma.bookingOpportunity.findUnique({
    where: { id: opportunityId },
  });

  if (!opportunity) {
    return { success: false, error: "Opportunity not found." };
  }

  if (opportunity.status !== "open") {
    return { success: false, error: "This opportunity is no longer open for bidding." };
  }

  if (new Date() > opportunity.biddingClosesAt) {
    return { success: false, error: "The bidding window for this opportunity has closed." };
  }

  const minimumBid = Number(opportunity.minimumBidPerDay);
  if (bidPerDay < minimumBid) {
    return { success: false, error: `Bid must be at least $${minimumBid.toFixed(2)}/day (minimum bid).` };
  }

  // Check for existing bid
  const existingBid = await prisma.operatorBid.findUnique({
    where: {
      opportunityId_operatorId: { opportunityId, operatorId },
    },
  });

  if (existingBid) {
    if (existingBid.status === "withdrawn") {
      return { success: false, error: "You have withdrawn your bid on this opportunity and cannot re-bid." };
    }
    return { success: false, error: "You have already placed a bid on this opportunity." };
  }

  const rentalDays = opportunity.rentalDays;
  const bidTotal = parseFloat((bidPerDay * rentalDays).toFixed(2));
  const retailPerDay = Number(opportunity.retailPricePerDay);
  const estimatedMarginPerDay = parseFloat((retailPerDay - bidPerDay).toFixed(2));
  const estimatedMarginTotal = parseFloat((estimatedMarginPerDay * rentalDays).toFixed(2));

  const bid = await prisma.operatorBid.create({
    data: {
      opportunityId,
      operatorId,
      bidPerDay,
      bidTotal,
      estimatedMarginPerDay,
      estimatedMarginTotal,
      status: "pending",
      notes: notes || null,
    },
  });

  return {
    success: true,
    bid: {
      id: bid.id,
      bidPerDay: Number(bid.bidPerDay),
      bidTotal: Number(bid.bidTotal),
      estimatedMarginPerDay: Number(bid.estimatedMarginPerDay),
      estimatedMarginTotal: Number(bid.estimatedMarginTotal),
      status: bid.status,
    },
  };
}

export async function withdrawBid(bidId: number, operatorId: number): Promise<{ success: boolean; error?: string }> {
  const bid = await prisma.operatorBid.findUnique({
    where: { id: bidId },
    include: { opportunity: true },
  });

  if (!bid) return { success: false, error: "Bid not found." };
  if (bid.operatorId !== operatorId) return { success: false, error: "Unauthorized." };
  if (bid.status !== "pending") return { success: false, error: "Only pending bids can be withdrawn." };

  // Check bidding window still open
  if (new Date() > bid.opportunity.biddingClosesAt) {
    return { success: false, error: "Bidding window has closed; bid cannot be withdrawn." };
  }

  await prisma.operatorBid.update({
    where: { id: bidId },
    data: { status: "withdrawn", withdrawnAt: new Date() },
  });

  return { success: true };
}

export async function getOperatorBids(operatorId: number) {
  return prisma.operatorBid.findMany({
    where: { operatorId },
    include: {
      opportunity: {
        include: {
          sippCode: { select: { code: true, name: true } },
          market: { select: { marketName: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function acceptWinningBid(
  opportunityId: number,
  bidId: number
): Promise<{ success: boolean; settlementId?: number; error?: string }> {
  const opportunity = await prisma.bookingOpportunity.findUnique({
    where: { id: opportunityId },
    include: { bids: true },
  });

  if (!opportunity) return { success: false, error: "Opportunity not found." };
  if (opportunity.status !== "open" && opportunity.status !== "closed") {
    return { success: false, error: "Opportunity is not in a biddable state." };
  }

  const winningBid = await prisma.operatorBid.findUnique({
    where: { id: bidId },
  });

  if (!winningBid || winningBid.opportunityId !== opportunityId) {
    return { success: false, error: "Bid not found for this opportunity." };
  }

  if (winningBid.status !== "pending") {
    return { success: false, error: "Bid is not in a pending state." };
  }

  // Calculate settlement figures
  const retailTotal = Number(opportunity.retailPriceTotal);
  const winningBidTotal = Number(winningBid.bidTotal);
  const operatorMarginTotal = parseFloat((retailTotal - winningBidTotal).toFixed(2));

  // Platform revenue breakdown
  const paymentProcessingFee = parseFloat(
    (retailTotal * 0.029 + 0.30).toFixed(2)
  );
  const acquisitionCost = 15.00; // Default; could fetch from market
  const platformServicingFee = parseFloat((retailTotal * 0.05).toFixed(2));
  const profitMargin = parseFloat((retailTotal * 0.08).toFixed(2));
  const platformRevenue = parseFloat(
    (paymentProcessingFee + acquisitionCost + platformServicingFee + profitMargin).toFixed(2)
  );

  // Create settlement
  const settlement = await prisma.bidSettlement.create({
    data: {
      settlementReference: generateSettlementReference(),
      opportunityId,
      winningBidId: bidId,
      operatorId: winningBid.operatorId,
      retailPriceTotal: retailTotal,
      winningBidTotal,
      operatorMarginTotal,
      platformRevenue,
      paymentProcessingFee,
      acquisitionCost,
      status: "pending",
      operatorNotifiedAt: new Date(),
    },
  });

  // Update winning bid status
  await prisma.operatorBid.update({
    where: { id: bidId },
    data: { status: "won" },
  });

  // Mark all other bids as lost
  await prisma.operatorBid.updateMany({
    where: {
      opportunityId,
      id: { not: bidId },
      status: "pending",
    },
    data: { status: "lost" },
  });

  // Close the opportunity
  await prisma.bookingOpportunity.update({
    where: { id: opportunityId },
    data: { status: "awarded" },
  });

  return { success: true, settlementId: settlement.id };
}

export async function autoAcceptLowestBid(opportunityId: number): Promise<{ success: boolean; error?: string }> {
  const opportunity = await prisma.bookingOpportunity.findUnique({
    where: { id: opportunityId },
    include: {
      bids: {
        where: { status: "pending" },
        orderBy: { bidTotal: "asc" },
      },
    },
  });

  if (!opportunity) return { success: false, error: "Opportunity not found." };
  if (!opportunity.autoAcceptLowest) return { success: false, error: "Auto-accept is not enabled for this opportunity." };
  if (opportunity.bids.length === 0) {
    // No bids — close with no winner
    await prisma.bookingOpportunity.update({
      where: { id: opportunityId },
      data: { status: "closed" },
    });
    return { success: false, error: "No bids received. Opportunity closed." };
  }

  const lowestBid = opportunity.bids[0];
  const result = await acceptWinningBid(opportunityId, lowestBid.id);
  return result;
}

export async function getAllBidsForOpportunity(opportunityId: number) {
  return prisma.operatorBid.findMany({
    where: { opportunityId },
    include: {
      operator: {
        select: { id: true, businessName: true, email: true, ownerName: true },
      },
    },
    orderBy: { bidTotal: "asc" },
  });
}

export async function getSettlements(filters?: { status?: string; operatorId?: number }) {
  const where: Record<string, unknown> = {};
  if (filters?.status) where.status = filters.status;
  if (filters?.operatorId) where.operatorId = filters.operatorId;

  return prisma.bidSettlement.findMany({
    where,
    include: {
      opportunity: {
        include: {
          sippCode: { select: { code: true, name: true } },
          market: { select: { marketName: true } },
        },
      },
      winningBid: {
        select: { bidPerDay: true, bidTotal: true },
      },
      operator: {
        select: { id: true, businessName: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
