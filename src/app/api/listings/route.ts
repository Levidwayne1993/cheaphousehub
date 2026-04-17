import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');
    const listing_type = searchParams.get('type');
    const min_price = searchParams.get('min_price');
    const max_price = searchParams.get('max_price');
    const bedrooms = searchParams.get('bedrooms');
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '24'), 100);
    const query = searchParams.get('q');
    const offset = (page - 1) * limit;

    let dbQuery = supabaseAdmin
      .from('properties')
      .select('*', { count: 'exact' });

    if (state) dbQuery = dbQuery.eq('state', state.toUpperCase());
    if (listing_type) dbQuery = dbQuery.eq('listing_type', listing_type);
    if (min_price) dbQuery = dbQuery.gte('price', parseInt(min_price));
    if (max_price) dbQuery = dbQuery.lte('price', parseInt(max_price));
    if (bedrooms) dbQuery = dbQuery.gte('bedrooms', parseInt(bedrooms));
    if (query) dbQuery = dbQuery.or(`title.ilike.%${query}%,city.ilike.%${query}%,address.ilike.%${query}%,zip.ilike.%${query}%`);

    // Sorting
    if (sort === 'price_asc') dbQuery = dbQuery.order('price', { ascending: true });
    else if (sort === 'price_desc') dbQuery = dbQuery.order('price', { ascending: false });
    else if (sort === 'savings') dbQuery = dbQuery.order('savings_pct', { ascending: false, nullsFirst: false });
    else dbQuery = dbQuery.order('created_at', { ascending: false });

    dbQuery = dbQuery.range(offset, offset + limit - 1);

    const { data, count, error } = await dbQuery;

    if (error) {
      console.error('Listings query error:', error);
      return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
    }

    return NextResponse.json({
      properties: data || [],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (err: any) {
    console.error('Listings API error:', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
