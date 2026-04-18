// src/app/api/listings/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const state = searchParams.get('state') || '';
    const listing_type = searchParams.get('listing_type') || '';
    const min_price = searchParams.get('min_price') || '';
    const max_price = searchParams.get('max_price') || '';
    const min_beds = searchParams.get('min_beds') || '';
    const sort_by = searchParams.get('sort_by') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const per_page = parseInt(searchParams.get('per_page') || '24');

    let dbQuery = supabase
      .from('properties')
      .select('*', { count: 'exact' });

    // Text search across address, city, state, zip
    if (query) {
      dbQuery = dbQuery.or(
        `address.ilike.%${query}%,city.ilike.%${query}%,state.ilike.%${query}%,zip.ilike.%${query}%`
      );
    }

    // Filters
    if (state) {
      dbQuery = dbQuery.ilike('state', state);
    }
    if (listing_type) {
      dbQuery = dbQuery.eq('listing_type', listing_type);
    }
    if (min_price) {
      dbQuery = dbQuery.gte('price', parseInt(min_price));
    }
    if (max_price) {
      dbQuery = dbQuery.lte('price', parseInt(max_price));
    }
    if (min_beds) {
      dbQuery = dbQuery.gte('beds', parseInt(min_beds));
    }

    // Sorting
    switch (sort_by) {
      case 'price_low':
        dbQuery = dbQuery.order('price', { ascending: true });
        break;
      case 'price_high':
        dbQuery = dbQuery.order('price', { ascending: false });
        break;
      case 'savings':
        dbQuery = dbQuery.order('savings_pct', { ascending: false, nullsFirst: false });
        break;
      case 'newest':
      default:
        dbQuery = dbQuery.order('created_at', { ascending: false });
        break;
    }

    // Pagination
    const from = (page - 1) * per_page;
    const to = from + per_page - 1;
    dbQuery = dbQuery.range(from, to);

    const { data, count, error } = await dbQuery;

    if (error) {
      console.error('Listings query error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch listings', details: error.message },
        { status: 500 }
      );
    }

    // Get unique states for filter dropdown
    const { data: stateList } = await supabase
      .from('properties')
      .select('state')
      .not('state', 'is', null);

    const uniqueStates = [...new Set(stateList?.map(s => s.state).filter(Boolean))].sort();

    // Get unique listing types for filter dropdown
    const { data: typeList } = await supabase
      .from('properties')
      .select('listing_type')
      .not('listing_type', 'is', null);

    const uniqueTypes = [...new Set(typeList?.map(t => t.listing_type).filter(Boolean))].sort();

    return NextResponse.json({
      listings: data || [],
      total: count || 0,
      page,
      per_page,
      total_pages: Math.ceil((count || 0) / per_page),
      filters: {
        states: uniqueStates,
        listing_types: uniqueTypes,
      },
    });
  } catch (error: any) {
    console.error('Listings API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings', details: error.message },
      { status: 500 }
    );
  }
}
