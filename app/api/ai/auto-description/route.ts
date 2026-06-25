import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
  baseURL: process.env.OPENAI_API_BASE || 'https://api.openai.com/v1',
});

function generateFallbackDescription(
  year: number,
  make: string,
  model: string,
  trim: string | null,
  category: string,
  features: string[],
  city: string | null
): string {
  const featureList = features.length > 0
    ? ` Equipped with ${features.slice(0, 3).join(', ')}.`
    : '';
  const locationStr = city ? ` Available in ${city}.` : '';
  
  const descriptions: Record<string, string> = {
    Luxury: `Experience the pinnacle of automotive excellence in this ${year} ${make} ${model}${trim ? ` ${trim}` : ''}. This premium ${category.toLowerCase()} delivers an unmatched combination of performance, comfort, and technology.${featureList}${locationStr}`,
    SUV: `Explore with confidence in this ${year} ${make} ${model}${trim ? ` ${trim}` : ''}. This spacious ${category} offers the perfect blend of versatility and comfort for any adventure.${featureList}${locationStr}`,
    Sports: `Feel the thrill behind the wheel of this ${year} ${make} ${model}${trim ? ` ${trim}` : ''}. This high-performance ${category.toLowerCase()} delivers an exhilarating driving experience.${featureList}${locationStr}`,
    Electric: `Drive sustainably in this ${year} ${make} ${model}${trim ? ` ${trim}` : ''}. This cutting-edge electric vehicle combines eco-friendly performance with modern technology.${featureList}${locationStr}`,
    Truck: `Get the job done in this ${year} ${make} ${model}${trim ? ` ${trim}` : ''}. This capable ${category.toLowerCase()} is ready for work, adventure, or everyday driving.${featureList}${locationStr}`,
  };

  return descriptions[category] || `Drive in style with this ${year} ${make} ${model}${trim ? ` ${trim}` : ''}. This well-maintained ${category.toLowerCase()} offers a comfortable and reliable driving experience.${featureList}${locationStr}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vehicleId, year, make, model, trim, category, features, city, saveToVehicle } = body;

    if (!year || !make || !model) {
      return NextResponse.json({ success: false, error: 'Year, make, and model are required' }, { status: 400 });
    }

    const featuresList = features || [];
    let description = '';

    // Try OpenAI first
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey && apiKey !== 'sk-placeholder-openai-key' && apiKey.startsWith('sk-')) {
      try {
        const prompt = `Write a compelling 2-3 sentence vehicle rental description for a ${year} ${make} ${model}${trim ? ` ${trim}` : ''} (${category || 'Sedan'}).
${featuresList.length > 0 ? `Features: ${featuresList.join(', ')}.` : ''}
${city ? `Location: ${city}.` : ''}
Make it enthusiastic but professional. Focus on the driving experience and key benefits for renters. Do not mention pricing.`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 150,
          temperature: 0.7,
        });

        description = completion.choices[0]?.message?.content?.trim() || '';
      } catch (aiError) {
        console.error('OpenAI error, using fallback:', aiError);
        description = generateFallbackDescription(year, make, model, trim, category || 'Sedan', featuresList, city);
      }
    } else {
      // Use algorithmic fallback
      description = generateFallbackDescription(year, make, model, trim, category || 'Sedan', featuresList, city);
    }

    // Save to vehicle if requested
    if (saveToVehicle && vehicleId) {
      await prisma.vehicle.update({
        where: { id: parseInt(vehicleId) },
        data: {
          description,
          aiDescriptionGenerated: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      description,
      aiGenerated: !!(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-placeholder-openai-key'),
    });
  } catch (error) {
    console.error('Auto-description error:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate description' }, { status: 500 });
  }
}
