import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface PricingSuggestion {
  suggestedDailyRate: number;
  minRate: number;
  maxRate: number;
  reasoning: string;
  factors: {
    category: string;
    season: string;
    location: string;
    demand: string;
    competition: string;
  };
}

// Base rates by vehicle category
const CATEGORY_BASE_RATES: Record<string, { min: number; base: number; max: number }> = {
  Economy: { min: 35, base: 45, max: 65 },
  Sedan: { min: 45, base: 65, max: 95 },
  SUV: { min: 65, base: 85, max: 130 },
  Truck: { min: 55, base: 75, max: 110 },
  Luxury: { min: 120, base: 175, max: 300 },
  Sports: { min: 100, base: 150, max: 250 },
  Van: { min: 70, base: 95, max: 140 },
  Electric: { min: 70, base: 95, max: 150 },
  Convertible: { min: 90, base: 130, max: 200 },
  Minivan: { min: 60, base: 80, max: 120 },
};

// Location demand multipliers
const LOCATION_MULTIPLIERS: Record<string, number> = {
  'Miami': 1.25,
  'New York': 1.35,
  'Los Angeles': 1.30,
  'San Francisco': 1.30,
  'Las Vegas': 1.20,
  'Orlando': 1.15,
  'Chicago': 1.15,
  'Austin': 1.10,
  'Tampa': 1.10,
  'Denver': 1.10,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vehicleId, category, make, model, year, city, targetDate } = body;

    if (!category) {
      return NextResponse.json({ success: false, error: 'Category is required' }, { status: 400 });
    }

    // Get base rates for category
    const baseRates = CATEGORY_BASE_RATES[category] || CATEGORY_BASE_RATES.Sedan;
    
    // Calculate seasonal multiplier
    const date = targetDate ? new Date(targetDate) : new Date();
    const month = date.getMonth();
    let seasonMultiplier = 1.0;
    let seasonLabel = 'Regular season';
    
    if (month >= 5 && month <= 7) {
      seasonMultiplier = 1.20;
      seasonLabel = 'Peak summer season (+20%)';
    } else if (month >= 10 && month <= 11) {
      seasonMultiplier = 1.15;
      seasonLabel = 'Holiday season (+15%)';
    } else if (month >= 2 && month <= 4) {
      seasonMultiplier = 1.05;
      seasonLabel = 'Spring travel season (+5%)';
    } else if (month === 0 || month === 1) {
      seasonMultiplier = 0.90;
      seasonLabel = 'Off-peak winter (-10%)';
    }

    // Location multiplier
    const cityKey = city ? Object.keys(LOCATION_MULTIPLIERS).find(
      k => city.toLowerCase().includes(k.toLowerCase())
    ) : null;
    const locationMultiplier = cityKey ? LOCATION_MULTIPLIERS[cityKey] : 1.0;
    const locationLabel = cityKey
      ? `${cityKey} high-demand market (+${Math.round((locationMultiplier - 1) * 100)}%)`
      : 'Standard market';

    // Year/age multiplier
    const currentYear = new Date().getFullYear();
    const vehicleAge = currentYear - (year || currentYear);
    let ageMultiplier = 1.0;
    let demandLabel = 'Standard demand';
    
    if (vehicleAge <= 1) {
      ageMultiplier = 1.15;
      demandLabel = 'New vehicle premium (+15%)';
    } else if (vehicleAge <= 3) {
      ageMultiplier = 1.05;
      demandLabel = 'Recent model year (+5%)';
    } else if (vehicleAge >= 8) {
      ageMultiplier = 0.85;
      demandLabel = 'Older vehicle discount (-15%)';
    }

    // Check market competition (similar vehicles in same city)
    let competitionMultiplier = 1.0;
    let competitionLabel = 'No data';
    
    if (vehicleId) {
      const similarVehicles = await prisma.vehicle.findMany({
        where: {
          category,
          city: city || undefined,
          status: 'active',
          id: { not: parseInt(vehicleId) },
        },
        select: { dailyRate: true },
        take: 10,
      });

      if (similarVehicles.length > 0) {
        const avgRate = similarVehicles.reduce((sum, v) => sum + parseFloat(v.dailyRate.toString()), 0) / similarVehicles.length;
        competitionLabel = `${similarVehicles.length} similar vehicles, avg $${avgRate.toFixed(0)}/day`;
        
        // Adjust suggestion based on market
        if (avgRate > baseRates.base * 1.2) {
          competitionMultiplier = 1.10;
        } else if (avgRate < baseRates.base * 0.8) {
          competitionMultiplier = 0.95;
        }
      }
    }

    // Calculate suggested rate
    const suggestedRate = parseFloat(
      (baseRates.base * seasonMultiplier * locationMultiplier * ageMultiplier * competitionMultiplier).toFixed(2)
    );
    const minRate = parseFloat((baseRates.min * locationMultiplier).toFixed(2));
    const maxRate = parseFloat((baseRates.max * locationMultiplier * seasonMultiplier).toFixed(2));

    const suggestion: PricingSuggestion = {
      suggestedDailyRate: suggestedRate,
      minRate,
      maxRate,
      reasoning: `Based on ${category} category rates in ${city || 'your area'} with current market conditions.`,
      factors: {
        category: `${category} base: $${baseRates.base}/day`,
        season: seasonLabel,
        location: locationLabel,
        demand: demandLabel,
        competition: competitionLabel,
      },
    };

    return NextResponse.json({ success: true, suggestion });
  } catch (error) {
    console.error('Smart pricing error:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate pricing suggestion' }, { status: 500 });
  }
}
