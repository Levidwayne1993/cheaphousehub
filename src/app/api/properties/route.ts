export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const state = url.searchParams.get('state') || '';
    const listing_type = url.searchParams.get('type') || '';
    const min_price = url.searchParams.get('min_price') || '';
    const max_price = url.searchParams.get('max_price') || '';
    const bedrooms = url.searchParams.get('bedrooms') || '';
    const sort_by = url.searchParams.get('sort') || 'newest';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '24'), 100);
    const query = url.searchParams.get('q') || '';

    const supabase = getSupabase();
    let dbQuery = supabase.from('properties').select('*', { count: 'exact' });

    if (state) dbQuery = dbQuery.eq('state', state.toUpperCase());
    if (listing_type) dbQuery = dbQuery.eq('listing_type', listing_type);
    if (min_price) dbQuery = dbQuery.gte('price', parseFloat(min_price));
    if (max_price) dbQuery = dbQuery.lte('price', parseFloat(max_price));
    if (bedrooms) dbQuery = dbQuery.gte('bedrooms', parseInt(bedrooms));
    if (query) {
      dbQuery = dbQuery.or(
        `title.ilike.%${query}%,city.ilike.%${query}%,state.ilike.%${query}%,zip.ilike.%${query}%`
      );
    }

    switch (sort_by) {
      case 'price_asc':
        dbQuery = dbQuery.order('price', { ascending: true });
        break;
      case 'price_desc':
        dbQuery = dbQuery.order('price', { ascending: false });
        break;
      case 'savings':
        dbQuery = dbQuery.order('savings_pct', { ascending: false, nullsFirst: false });
        break;
      default:
        dbQuery = dbQuery.order('created_at', { ascending: false });
        break;
    }

    const from = (page - 1) * limit;
    dbQuery = dbQuery.range(from, from + limit - 1);

    const { data, error, count } = await dbQuery;

    if (error) {
      console.error('Properties query error:', error);
      return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
    }

    return NextResponse.json({
      properties: data || [],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
      limit,
    });
  } catch (err: any) {
    console.error('Properties API error:', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
