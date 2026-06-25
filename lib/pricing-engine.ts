// Drive Connect - Pricing Engine
// Calculates retail pricing shown to renters based on SIPP code, market, duration, season, demand

import { prisma } from "@/lib/prisma";

export interface PricingInput {
  sippCode: string;
  marketCode: string;
  pickupDate: Date;
  dropoffDate: Date;
  demandLevel?: "low" | "normal" | "high" | "very_high";
}

export interface PricingBreakdown {
  sippCode: string;
  sippName: string;
  marketName: string;
  baseRatePerDay: number;
  marketMultiplier: number;
  durationMultiplier: number;
  seasonMultiplier: number;
  demandMultiplier: number;
  finalRatePerDay: number;
  rentalDays: number;
  retailPriceTotal: number;
  minimumBidPerDay: number;
  minimumBidTotal: number;
  acquisitionCost: number;
  paymentProcessingFee: number;
  platformServicingFee: number;
  profitMargin: number;
  appliedRules: string[];
}

// Platform cost configuration
const PLATFORM_CONFIG = {
  paymentProcessingPercent: 0.029,  // 2.9%
  paymentProcessingFixed: 0.30,     // $0.30 per transaction
  platformServicingPercent: 0.05,   // 5% of retail
  profitMarginPercent: 0.08,        // 8% of retail
};

export async function calculateRetailPrice(input: PricingInput): Promise<PricingBreakdown> {
  const { sippCode, marketCode, pickupDate, dropoffDate, demandLevel = "normal" } = input;

  // Calculate rental days
  const msPerDay = 1000 * 60 * 60 * 24;
  const rentalDays = Math.max(1, Math.round((dropoffDate.getTime() - pickupDate.getTime()) / msPerDay));

  // Fetch SIPP code
  const sipp = await prisma.sippCode.findUnique({
    where: { code: sippCode, isActive: true },
  });
  if (!sipp) throw new Error(`SIPP code ${sippCode} not found or inactive`);

  // Fetch market pricing
  const market = await prisma.marketPricing.findUnique({
    where: { marketCode, isActive: true },
  });
  if (!market) throw new Error(`Market ${marketCode} not found or inactive`);

  // Fetch active pricing rules
  const rules = await prisma.pricingRule.findMany({
    where: { isActive: true },
    orderBy: { priority: "desc" },
  });

  const baseRate = Number(sipp.baseRatePerDay);
  const marketMultiplier = Number(market.priceMultiplier);
  const acquisitionCost = Number(market.acquisitionCost);
  const appliedRules: string[] = [];

  // Duration multiplier
  let durationMultiplier = 1.0;
  const durationRules = rules
    .filter((r) => r.ruleType === "duration")
    .sort((a, b) => Number(b.conditionValue) - Number(a.conditionValue));

  for (const rule of durationRules) {
    const minDays = parseInt(rule.conditionValue);
    if (rentalDays >= minDays) {
      durationMultiplier = Number(rule.multiplier);
      appliedRules.push(`${rule.ruleName} (${(Number(rule.multiplier) * 100 - 100).toFixed(0)}%)`);
      break; // Apply only the highest matching duration rule
    }
  }

  // Season multiplier (based on pickup month)
  let seasonMultiplier = 1.0;
  const pickupMonth = pickupDate.getMonth() + 1; // 1-12
  const seasonRules = rules
    .filter((r) => r.ruleType === "season")
    .sort((a, b) => b.priority - a.priority);

  for (const rule of seasonRules) {
    const months = rule.conditionValue.split(",").map((m) => parseInt(m.trim()));
    if (months.includes(pickupMonth)) {
      seasonMultiplier = Math.max(seasonMultiplier, Number(rule.multiplier));
      appliedRules.push(`${rule.ruleName} (+${((Number(rule.multiplier) - 1) * 100).toFixed(0)}%)`);
    }
  }

  // Demand multiplier
  let demandMultiplier = 1.0;
  const demandMap: Record<string, number> = {
    low: 0.9,
    normal: 1.0,
    high: 1.15,
    very_high: 1.25,
  };
  demandMultiplier = demandMap[demandLevel] ?? 1.0;
  if (demandLevel !== "normal") {
    appliedRules.push(`${demandLevel.replace("_", " ")} demand (${((demandMultiplier - 1) * 100).toFixed(0)}%)`);
  }

  // Final retail rate per day
  const finalRatePerDay = parseFloat(
    (baseRate * marketMultiplier * durationMultiplier * seasonMultiplier * demandMultiplier).toFixed(2)
  );
  const retailPriceTotal = parseFloat((finalRatePerDay * rentalDays).toFixed(2));

  // Minimum bid calculation
  const paymentProcessingFee = parseFloat(
    (retailPriceTotal * PLATFORM_CONFIG.paymentProcessingPercent + PLATFORM_CONFIG.paymentProcessingFixed).toFixed(2)
  );
  const platformServicingFee = parseFloat((retailPriceTotal * PLATFORM_CONFIG.platformServicingPercent).toFixed(2));
  const profitMargin = parseFloat((retailPriceTotal * PLATFORM_CONFIG.profitMarginPercent).toFixed(2));

  const totalCosts = acquisitionCost + paymentProcessingFee + platformServicingFee + profitMargin;
  const minimumBidTotal = parseFloat(totalCosts.toFixed(2));
  const minimumBidPerDay = parseFloat((minimumBidTotal / rentalDays).toFixed(2));

  return {
    sippCode: sipp.code,
    sippName: sipp.name,
    marketName: market.marketName,
    baseRatePerDay: baseRate,
    marketMultiplier,
    durationMultiplier,
    seasonMultiplier,
    demandMultiplier,
    finalRatePerDay,
    rentalDays,
    retailPriceTotal,
    minimumBidPerDay,
    minimumBidTotal,
    acquisitionCost,
    paymentProcessingFee,
    platformServicingFee,
    profitMargin,
    appliedRules,
  };
}

export async function getSippCodes() {
  return prisma.sippCode.findMany({
    where: { isActive: true },
    orderBy: { code: "asc" },
  });
}

export async function getMarkets() {
  return prisma.marketPricing.findMany({
    where: { isActive: true },
    orderBy: { marketName: "asc" },
  });
}

export async function getPricingRules() {
  return prisma.pricingRule.findMany({
    orderBy: [{ ruleType: "asc" }, { priority: "desc" }],
  });
}
