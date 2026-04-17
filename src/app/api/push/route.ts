export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// POST /api/push — Receives property data from CityScraper
export async function POST(request: NextRequest) {
  try {
    // Verify API key
    const apiKey = request.headers.get('x-api-key');
    const expectedKey = process.env.PUSH_API_KEY;

    if (!expectedKey || apiKey !== expectedKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { properties } = body;

    if (!Array.isArray(properties) || properties.length === 0) {
      return NextResponse.json({ error: 'No properties provided' }, { status: 400 });
    }

    // Upsert properties (update if source_url already exists)
    const { data, error } = await supabaseAdmin
      .from('properties')
      .upsert(
        properties.map((p: any) => ({
          title: p.title || 'Untitled Property',
          address: p.address || '',
          city: p.city || '',
          state: p.state || '',
          zip: p.zip || '',
          price: p.price || 0,
          original_price: p.original_price || null,
          bedrooms: p.bedrooms || null,
          bathrooms: p.bathrooms || null,
          sqft: p.sqft || null,
          lot_size: p.lot_size || null,
          property_type: p.property_type || 'single-family',
          listing_type: p.listing_type || 'cheap',
          description: p.description || '',
          source: p.source || 'cityscraper',
          source_url: p.source_url || `cityscraper-${Date.now()}-${Math.random()}`,
          image_urls: p.image_urls || [],
          lat: p.lat || null,
          lng: p.lng || null,
          savings_pct: p.original_price && p.original_price > p.price
            ? Math.round(((p.original_price - p.price) / p.original_price) * 100)
            : null,
          scraped_at: p.scraped_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })),
        { onConflict: 'source_url', ignoreDuplicates: false }
      );

    if (error) {
      console.error('Push upsert error:', error);
      return NextResponse.json({ error: 'Failed to upsert properties' }, { status: 500 });
    }

    // Log the push
    await supabaseAdmin.from('push_log').insert({
      source: 'cityscraper',
      properties_count: properties.length,
      status: 'success',
    });

    return NextResponse.json({
      success: true,
      message: `${properties.length} properties upserted successfully`,
      count: properties.length,
    });
  } catch (err: any) {
    console.error('Push API error:', err.message);

    // Log failed push
    await supabaseAdmin.from('push_log').insert({
      source: 'cityscraper',
      properties_count: 0,
      status: 'error',
      error_message: err.message,
    });

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

