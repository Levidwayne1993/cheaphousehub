export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // Total listings
    const { count: total } = await supabaseAdmin
      .from('properties')
      .select('*', { count: 'exact', head: true });

    // Average price
    const { data: avgData } = await supabaseAdmin
      .from('properties')
      .select('price')
      .limit(1000);
    
    const avgPrice = avgData && avgData.length > 0
      ? Math.round(avgData.reduce((sum, p) => sum + (p.price || 0), 0) / avgData.length)
      : 0;

    // Average savings
    const { data: savingsData } = await supabaseAdmin
      .from('properties')
      .select('savings_pct')
      .not('savings_pct', 'is', null)
      .limit(1000);
    
    const avgSavings = savingsData && savingsData.length > 0
      ? Math.round(savingsData.reduce((sum, p) => sum + (p.savings_pct || 0), 0) / savingsData.length)
      : 0;

    // States covered
    const { data: statesData } = await supabaseAdmin
      .from('properties')
      .select('state')
      .limit(1000);
    
    const uniqueStates = new Set(statesData?.map(p => p.state).filter(Boolean));

    // Counts by type
    const types = ['foreclosure', 'auction', 'tax-lien', 'bank-owned'];
    const typeCounts: Record<string, number> = {};
    
    for (const type of types) {
      const { count } = await supabaseAdmin
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('listing_type', type);
      typeCounts[type] = count || 0;
    }

    return NextResponse.json({
      total_listings: total || 0,
      avg_price: avgPrice,
      avg_savings: avgSavings,
      states_covered: uniqueStates.size,
      foreclosures: typeCounts['foreclosure'] || 0,
      auctions: typeCounts['auction'] || 0,
      tax_liens: typeCounts['tax-lien'] || 0,
      bank_owned: typeCounts['bank-owned'] || 0,
    });
  } catch (err: any) {
    console.error('Stats API error:', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

