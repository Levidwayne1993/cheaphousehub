export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = getSupabase();

    const { count: total } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true });

    const { data: stateData } = await supabase
      .from('properties')
      .select('state');
    const uniqueStates = new Set((stateData || []).map((p: any) => p.state));

    const { count: foreclosures } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('listing_type', 'foreclosure');

    const { count: auctions } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('listing_type', 'auction');

    const { count: taxLiens } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('listing_type', 'tax-lien');

    const { count: bankOwned } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('listing_type', 'bank-owned');

    return NextResponse.json({
      total_listings: total || 0,
      states_covered: uniqueStates.size,
      foreclosures: foreclosures || 0,
      auctions: auctions || 0,
      tax_liens: taxLiens || 0,
      bank_owned: bankOwned || 0,
    });
  } catch (err: any) {
    console.error('Stats API error:', err.message);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
