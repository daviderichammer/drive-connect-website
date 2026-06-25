import { NextRequest, NextResponse } from 'next/server';

export const INSURANCE_TIERS = {
  basic: {
    id: 'basic',
    name: 'Basic Coverage',
    dailyRate: 9.99,
    description: 'Essential liability protection for budget-conscious renters.',
    coverage: [
      'Liability coverage up to $50,000',
      'Third-party property damage',
      'Basic medical coverage',
    ],
    notCovered: [
      'Collision damage to rental vehicle',
      'Theft of rental vehicle',
      'Roadside assistance',
    ],
    deductible: '$2,500',
    color: '#6b7280',
    icon: '🛡️',
  },
  standard: {
    id: 'standard',
    name: 'Standard Coverage',
    dailyRate: 14.99,
    description: 'Comprehensive protection covering most rental scenarios.',
    coverage: [
      'Liability coverage up to $100,000',
      'Collision damage to rental vehicle',
      'Third-party property damage',
      'Medical coverage up to $10,000',
      'Uninsured motorist protection',
    ],
    notCovered: [
      'Vehicle theft',
      'Roadside assistance',
    ],
    deductible: '$1,000',
    color: '#2563eb',
    icon: '🛡️',
    popular: true,
  },
  premium: {
    id: 'premium',
    name: 'Premium Coverage',
    dailyRate: 24.99,
    description: 'Complete peace of mind with zero out-of-pocket risk.',
    coverage: [
      'Liability coverage up to $300,000',
      'Full collision & comprehensive coverage',
      'Vehicle theft protection',
      'Medical coverage up to $50,000',
      'Uninsured/underinsured motorist',
      '24/7 Roadside assistance',
      'Rental car replacement if vehicle is unavailable',
    ],
    notCovered: [],
    deductible: '$0',
    color: '#DC2626',
    icon: '⭐',
  },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get('days') || '1');

  const tiers = Object.values(INSURANCE_TIERS).map(tier => ({
    ...tier,
    totalCost: parseFloat((tier.dailyRate * days).toFixed(2)),
    days,
  }));

  return NextResponse.json({ success: true, tiers });
}
