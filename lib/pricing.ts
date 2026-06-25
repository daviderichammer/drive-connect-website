// Phase 6E: Dynamic Pricing Engine
// Handles peak/off-peak multipliers, duration discounts, early bird pricing

export interface PricingInput {
  dailyRate: number;
  startDate: string;
  endDate: string;
  protectionPlan?: string;
  insuranceTier?: string;
  deliveryOption?: string;
  deliveryFee?: number;
}

export interface PricingBreakdown {
  days: number;
  basePrice: number;
  pricingMultiplier: number;
  peakLabel: string;
  durationDiscount: number;
  durationDiscountLabel: string;
  earlyBirdDiscount: number;
  discountedBase: number;
  protectionPrice: number;
  insuranceAmount: number;
  deliveryPrice: number;
  subtotal: number;
  taxes: number;
  totalPrice: number;
  savings: number;
}

// US Federal Holidays (approximate dates for current year)
function getUSHolidays(year: number): string[] {
  return [
    `${year}-01-01`, // New Year's Day
    `${year}-01-15`, // MLK Day (approx 3rd Monday Jan)
    `${year}-02-19`, // Presidents Day (approx 3rd Monday Feb)
    `${year}-05-27`, // Memorial Day (approx last Monday May)
    `${year}-06-19`, // Juneteenth
    `${year}-07-04`, // Independence Day
    `${year}-09-02`, // Labor Day (approx 1st Monday Sep)
    `${year}-11-11`, // Veterans Day
    `${year}-11-28`, // Thanksgiving (approx 4th Thursday Nov)
    `${year}-12-25`, // Christmas
  ];
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
}

function isSummerPeak(date: Date): boolean {
  const month = date.getMonth();
  return month >= 5 && month <= 7; // June, July, August
}

function isHolidayPeriod(date: Date): boolean {
  const month = date.getMonth();
  // Thanksgiving week + Christmas/New Year period
  return (month === 10 && date.getDate() >= 24) || // Late November
    (month === 11 && date.getDate() >= 20) || // Late December
    (month === 0 && date.getDate() <= 5);     // Early January
}

function isHoliday(date: Date): boolean {
  const year = date.getFullYear();
  const holidays = getUSHolidays(year);
  const dateStr = date.toISOString().split('T')[0];
  return holidays.includes(dateStr);
}

export function calculatePricingMultiplier(startDate: Date, endDate: Date): {
  multiplier: number;
  label: string;
} {
  let multiplier = 1.0;
  const labels: string[] = [];

  // Check if rental spans weekend
  const current = new Date(startDate);
  let weekendDays = 0;
  let totalDays = 0;
  
  while (current <= endDate) {
    totalDays++;
    if (isWeekend(current)) weekendDays++;
    current.setDate(current.getDate() + 1);
  }

  const weekendRatio = weekendDays / totalDays;

  // Weekend premium
  if (weekendRatio >= 0.5) {
    multiplier += 0.15;
    labels.push('Weekend (+15%)');
  } else if (weekendRatio > 0) {
    multiplier += 0.07;
    labels.push('Partial weekend (+7%)');
  }

  // Summer peak season
  if (isSummerPeak(startDate) || isSummerPeak(endDate)) {
    multiplier += 0.10;
    labels.push('Summer peak (+10%)');
  }

  // Holiday period
  if (isHolidayPeriod(startDate) || isHolidayPeriod(endDate)) {
    multiplier += 0.20;
    labels.push('Holiday period (+20%)');
  }

  // Holiday day itself
  if (isHoliday(startDate) || isHoliday(endDate)) {
    multiplier += 0.10;
    labels.push('Holiday (+10%)');
  }

  // Cap multiplier at 1.5x
  multiplier = Math.min(multiplier, 1.5);

  return {
    multiplier: parseFloat(multiplier.toFixed(3)),
    label: labels.length > 0 ? labels.join(', ') : 'Standard rate',
  };
}

export function calculateDurationDiscount(days: number, basePrice: number): {
  discount: number;
  label: string;
} {
  if (days >= 28) {
    const discount = parseFloat((basePrice * 0.20).toFixed(2));
    return { discount, label: 'Monthly discount (20%)' };
  } else if (days >= 7) {
    const discount = parseFloat((basePrice * 0.10).toFixed(2));
    return { discount, label: 'Weekly discount (10%)' };
  }
  return { discount: 0, label: '' };
}

export function calculateEarlyBirdDiscount(startDate: Date, basePrice: number): {
  discount: number;
  label: string;
} {
  const today = new Date();
  const daysUntilStart = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilStart >= 7) {
    const discount = parseFloat((basePrice * 0.05).toFixed(2));
    return { discount, label: 'Early bird discount (5%)' };
  }
  return { discount: 0, label: '' };
}

const PROTECTION_DAILY_RATES: Record<string, number> = {
  none: 0,
  basic: 15,
  standard: 29,
  premium: 49,
};

const INSURANCE_DAILY_RATES: Record<string, number> = {
  basic: 9.99,
  standard: 14.99,
  premium: 24.99,
};

export function calculateFullPricing(input: PricingInput): PricingBreakdown {
  const start = new Date(input.startDate + 'T00:00:00');
  const end = new Date(input.endDate + 'T00:00:00');
  const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

  // Base price (before multipliers)
  const basePrice = parseFloat((input.dailyRate * days).toFixed(2));

  // Peak/off-peak multiplier
  const { multiplier: pricingMultiplier, label: peakLabel } = calculatePricingMultiplier(start, end);
  const adjustedBase = parseFloat((basePrice * pricingMultiplier).toFixed(2));

  // Duration discount (applied after multiplier)
  const { discount: durationDiscount, label: durationDiscountLabel } = calculateDurationDiscount(days, adjustedBase);

  // Early bird discount (applied after duration discount)
  const afterDuration = adjustedBase - durationDiscount;
  const { discount: earlyBirdDiscount } = calculateEarlyBirdDiscount(start, afterDuration);

  const discountedBase = parseFloat((afterDuration - earlyBirdDiscount).toFixed(2));

  // Protection plan
  const protectionDailyRate = PROTECTION_DAILY_RATES[input.protectionPlan || 'standard'] || 29;
  const protectionPrice = parseFloat((protectionDailyRate * days).toFixed(2));

  // Insurance
  const insuranceDailyRate = INSURANCE_DAILY_RATES[input.insuranceTier || 'standard'] || 14.99;
  const insuranceAmount = parseFloat((insuranceDailyRate * days).toFixed(2));

  // Delivery fee
  const deliveryPrice = input.deliveryOption === 'delivery' ? (input.deliveryFee || 0) : 0;

  // Subtotal and taxes
  const subtotal = parseFloat((discountedBase + protectionPrice + insuranceAmount + deliveryPrice).toFixed(2));
  const taxes = parseFloat((subtotal * 0.07).toFixed(2));
  const totalPrice = parseFloat((subtotal + taxes).toFixed(2));

  // Total savings
  const savings = parseFloat((durationDiscount + earlyBirdDiscount).toFixed(2));

  return {
    days,
    basePrice,
    pricingMultiplier,
    peakLabel,
    durationDiscount,
    durationDiscountLabel,
    earlyBirdDiscount,
    discountedBase,
    protectionPrice,
    insuranceAmount,
    deliveryPrice,
    subtotal,
    taxes,
    totalPrice,
    savings,
  };
}
