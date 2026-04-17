'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PropertyCard } from '@/components/PropertyCard';
import { SearchFilters } from '@/components/SearchFilters';
import { Property } from '@/lib/types';

const SAMPLE_DATA: Property[] = [
  { id: '1', title: '3BR Ranch — Bank Foreclosure', address: '1234 Oak St', city: 'Tampa', state: 'FL', zip: '33601', price: 89000, original_price: 185000, bedrooms: 3, bathrooms: 2, sqft: 1450, lot_size: '0.25 acres', property_type: 'single-family', listing_type: 'foreclosure', description: 'Spacious 3-bedroom ranch in established neighborhood. Needs cosmetic updates. Great investment opportunity.', source: 'hud', source_url: '#', image_urls: [], lat: null, lng: null, savings_pct: 52, scraped_at: '2026-04-16', created_at: '2026-04-16', updated_at: '2026-04-16' },
  { id: '2', title: '4BR Colonial — Tax Lien Sale', address: '567 Maple Ave', city: 'Columbus', state: 'OH', zip: '43201', price: 42000, original_price: 120000, bedrooms: 4, bathrooms: 2, sqft: 1800, lot_size: '0.3 acres', property_type: 'single-family', listing_type: 'tax-lien', description: 'Large colonial home with 4 bedrooms. Tax lien property with clear title potential.', source: 'county', source_url: '#', image_urls: [], lat: null, lng: null, savings_pct: 65, scraped_at: '2026-04-16', created_at: '2026-04-16', updated_at: '2026-04-16' },
  { id: '3', title: '2BR Bungalow — Auction Property', address: '890 Peach Rd', city: 'Atlanta', state: 'GA', zip: '30301', price: 65000, original_price: 140000, bedrooms: 2, bathrooms: 1, sqft: 1100, lot_size: '0.15 acres', property_type: 'single-family', listing_type: 'auction', description: 'Charming bungalow in up-and-coming area. Auction property with strong rental potential.', source: 'auction.com', source_url: '#', image_urls: [], lat: null, lng: null, savings_pct: 54, scraped_at: '2026-04-16', created_at: '2026-04-16', updated_at: '2026-04-16' },
  { id: '4', title: '3BR Split-Level — Bank Owned', address: '321 Desert Dr', city: 'Phoenix', state: 'AZ', zip: '85001', price: 115000, original_price: 210000, bedrooms: 3, bathrooms: 2.5, sqft: 1650, lot_size: '0.2 acres', property_type: 'single-family', listing_type: 'bank-owned', description: 'REO property in great school district. Move-in ready with updated kitchen.', source: 'bank', source_url: '#', image_urls: [], lat: null, lng: null, savings_pct: 45, scraped_at: '2026-04-16', created_at: '2026-04-16', updated_at: '2026-04-16' },
  { id: '5', title: '5BR Victorian — Short Sale', address: '456 Woodward Ave', city: 'Detroit', state: 'MI', zip: '48201', price: 38000, original_price: 95000, bedrooms: 5, bathrooms: 3, sqft: 2400, lot_size: '0.35 acres', property_type: 'single-family', listing_type: 'short-sale', description: 'Historic Victorian with original woodwork. Incredible value in revitalizing neighborhood.', source: 'mls', source_url: '#', image_urls: [], lat: null, lng: null, savings_pct: 60, scraped_at: '2026-04-16', created_at: '2026-04-16', updated_at: '2026-04-16' },
  { id: '6', title: '2BR Cottage — Budget Home', address: '789 Beale St', city: 'Memphis', state: 'TN', zip: '38101', price: 55000, original_price: 110000, bedrooms: 2, bathrooms: 1, sqft: 950, lot_size: '0.12 acres', property_type: 'single-family', listing_type: 'cheap', description: 'Affordable cottage near downtown. Perfect starter home or rental property.', source: 'listing', source_url: '#', image_urls: [], lat: null, lng: null, savings_pct: 50, scraped_at: '2026-04-16', created_at: '2026-04-16', updated_at: '2026-04-16' },
  { id: '7', title: '3BR Townhouse — Foreclosure', address: '100 Main St', city: 'Orlando', state: 'FL', zip: '32801', price: 95000, original_price: 175000, bedrooms: 3, bathrooms: 2, sqft: 1350, lot_size: null, property_type: 'townhouse', listing_type: 'foreclosure', description: 'Modern townhouse near attractions. HOA included. Bank motivated to sell.', source: 'hud', source_url: '#', image_urls: [], lat: null, lng: null, savings_pct: 46, scraped_at: '2026-04-16', created_at: '2026-04-16', updated_at: '2026-04-16' },
  { id: '8', title: '4BR Craftsman — Tax Lien', address: '222 Elm St', city: 'Portland', state: 'OR', zip: '97201', price: 78000, original_price: 195000, bedrooms: 4, bathrooms: 2, sqft: 1900, lot_size: '0.28 acres', property_type: 'single-family', listing_type: 'tax-lien', description: 'Beautiful craftsman with covered porch. Tax lien opportunity in desirable neighborhood.', source: 'county', source_url: '#', image_urls: [], lat: null, lng: null, savings_pct: 60, scraped_at: '2026-04-16', created_at: '2026-04-16', updated_at: '2026-04-16' },
  { id: '9', title: '2BR Condo — Bank Owned', address: '555 Lake Dr', city: 'Chicago', state: 'IL', zip: '60601', price: 62000, original_price: 130000, bedrooms: 2, bathrooms: 1, sqft: 900, lot_size: null, property_type: 'condo', listing_type: 'bank-owned', description: 'Downtown condo with lake views. REO property priced to sell fast.', source: 'bank', source_url: '#', image_urls: [], lat: null, lng: null, savings_pct: 52, scraped_at: '2026-04-16', created_at: '2026-04-16', updated_at: '2026-04-16' },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>(SAMPLE_DATA);
  const [loading, setLoading] = useState(false);
  const [stateFilter, setStateFilter] = useState(searchParams.get('state') || '');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const state = searchParams.get('state');
    const type = searchParams.get('type');
    if (state) setStateFilter(state);
    if (type) setTypeFilter(type);
  }, [searchParams]);

  // Filter and sort the sample data locally (will use API with Supabase)
  const filtered = properties
    .filter(p => !stateFilter || p.state === stateFilter)
    .filter(p => !typeFilter || p.listing_type === typeFilter)
    .filter(p => !minPrice || p.price >= parseInt(minPrice))
    .filter(p => !maxPrice || p.price <= parseInt(maxPrice))
    .filter(p => !bedrooms || (p.bedrooms !== null && p.bedrooms >= parseInt(bedrooms)))
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'savings') return (b.savings_pct || 0) - (a.savings_pct || 0);
      return 0;
    });

  const handleApply = () => { /* filters are reactive */ };
  const handleReset = () => {
    setStateFilter('');
    setTypeFilter('');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('');
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-brand-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">Search Affordable Homes</h1>
          <p className="text-blue-200">
            {filtered.length} {filtered.length === 1 ? 'property' : 'properties'} found
            {stateFilter ? ` in ${stateFilter}` : ''}
            {typeFilter ? ` — ${typeFilter}` : ''}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-72 flex-shrink-0">
            <SearchFilters
              state={stateFilter}
              listingType={typeFilter}
              minPrice={minPrice}
              maxPrice={maxPrice}
              bedrooms={bedrooms}
              onStateChange={setStateFilter}
              onTypeChange={setTypeFilter}
              onMinPriceChange={setMinPrice}
              onMaxPriceChange={setMaxPrice}
              onBedroomsChange={setBedrooms}
              onApply={handleApply}
              onReset={handleReset}
            />
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Sort bar */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-500">{filtered.length} results</p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="savings">Biggest Savings</option>
              </select>
            </div>

            {/* Loading skeletons */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md">
                    <div className="h-48 skeleton" />
                    <div className="p-4 space-y-3">
                      <div className="h-6 w-24 skeleton" />
                      <div className="h-4 w-full skeleton" />
                      <div className="h-4 w-3/4 skeleton" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-600 mb-1">No properties found</h3>
                <p className="text-gray-400">Try adjusting your filters or search in a different state.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-400">Loading...</div></div>}>
      <SearchContent />
    </Suspense>
  );
}
