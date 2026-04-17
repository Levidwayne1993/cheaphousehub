export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, state, listing_type, min_price, max_price, min_bedrooms } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('saved_searches')
      .insert({
        email,
        state: state || null,
        listing_type: listing_type || null,
        min_price: min_price || null,
        max_price: max_price || null,
        min_bedrooms: min_bedrooms || null,
        notify: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Saved search error:', error);
      return NextResponse.json({ error: 'Failed to save search' }, { status: 500 });
    }

    return NextResponse.json({ success: true, saved_search: data });
  } catch (err: any) {
    console.error('Saved searches API error:', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
