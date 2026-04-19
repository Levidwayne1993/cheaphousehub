// ============================================================
// FILE: src/app/page.tsx
// ============================================================
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Property, LISTING_TYPES, US_STATES, formatPrice } from '@/lib/types';

const typeColors: Record<string, string> = {
  foreclosure: 'bg-red-100 text-red-700',
  auction: 'bg-amber-100 text-amber-700',
  'tax-lien': 'bg-purple-100 text-purple-700',
  'bank-owned': 'bg-blue-100 text-blue-700',
  'short-sale': 'bg-teal-100 text-teal-700',
  cheap: 'bg-green-100 text-green-700',
};

const typeLabels: Record<string, string> = {
  foreclosure: 'Foreclosure',
  auction: 'Auction',
  'tax-lien': 'Tax Lien',
  'bank-owned': 'Bank Owned',
  'short-sale': 'Short Sale',
  cheap: 'Budget Home',
};

function AnimatedCounter({ target, prefix = '', suffix = '' }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);

  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredListings, setFeaturedListings] = useState<Property[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [stats, setStats] = useState({
    total_listings: 0,
    states_covered: 0,
    avg_savings: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Fetch live stats from API
  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) {
          setStats({
            total_listings: data.total_listings || 0,
            states_covered: data.states_covered || 0,
            avg_savings: data.avg_savings || 0,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoadingStats(false));
  }, []);

  // Fetch featured listings (biggest savings) from API
  useEffect(() => {
    fetch('/api/listings?sort=savings&limit=6')
      .then((r) => r.json())
      .then((data) => {
        if (data.properties && data.properties.length > 0) {
          setFeaturedListings(data.properties);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingFeatured(false));
  }, []);

  return (
    <div>
      {/* ==================== HERO ==================== */}
      <section className="hero-gradient relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-white/90 text-sm font-medium">Live listings updated every 4 hours</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
              Find Affordable Homes
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-emerald-300">
                Across America
              </span>
            </h1>

            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
              Foreclosures, auctions, tax liens &amp; bank-owned properties — all in one place. Save up to
              <span className="text-emerald-300 font-bold"> 60% below market value</span>.
            </p>

            {/* Search bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex bg-white rounded-xl shadow-2xl shadow-black/20 overflow-hidden">
                <div className="flex-1 flex items-center px-4">
                  <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by city, state, or ZIP code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') window.location.href = `/search?q=${searchQuery}`;
                    }}
                    className="w-full py-4 text-gray-800 placeholder-gray-400 focus:outline-none text-base"
                  />
                </div>
                <Link
                  href={`/search?q=${searchQuery}`}
                  className="bg-brand-500 hover:bg-brand-600 text-white px-8 flex items-center font-semibold transition-colors"
                >
                  Search
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== STATS BAR ==================== */}
      <section className="bg-white border-b border-gray-100 -mt-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Active Listings', value: stats.total_listings, prefix: '' },
              { label: 'States Covered', value: stats.states_covered, prefix: '' },
              { label: 'Avg. Savings', value: stats.avg_savings, suffix: '%' },
              { label: 'Updated Daily', value: 4, suffix: 'x' },
            ].map((stat, i) => (
              <div key={i} className="stat-card text-center" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-2xl md:text-3xl font-extrabold text-brand-700">
                  {loadingStats ? (
                    <span className="inline-block w-16 h-8 skeleton rounded" />
                  ) : (
                    <AnimatedCounter target={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                  )}
                </div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CATEGORIES ==================== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Browse by Category</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Every listing type in one marketplace — find exactly what fits your budget and strategy.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {LISTING_TYPES.map((type) => (
              <Link key={type.value} href={`/search?type=${type.value}`}>
                <div className="category-card bg-white rounded-xl p-6 border border-gray-100 shadow-sm cursor-pointer">
                  <div className="text-4xl mb-3">{type.icon}</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{type.label}</h3>
                  <p className="text-sm text-gray-500">
                    {type.value === 'foreclosure' && 'Bank-repossessed homes sold below market value. Great deals for investors and first-time buyers.'}
                    {type.value === 'auction' && 'Properties sold to the highest bidder. Often 20-50% below retail with fast closing timelines.'}
                    {type.value === 'tax-lien' && 'Properties with unpaid taxes. Acquire homes for pennies on the dollar through tax sales.'}
                    {type.value === 'bank-owned' && 'REO properties owned by lenders. Negotiable prices with motivated sellers.'}
                    {type.value === 'short-sale' && 'Homes sold for less than the mortgage balance. Significant discounts with lender approval.'}
                    {type.value === 'cheap' && 'Affordable homes under market value. Budget-friendly options across all 50 states.'}
                  </p>
                  <div className="mt-4 text-brand-500 text-sm font-semibold flex items-center gap-1">
                    Browse {type.label}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURED LISTINGS ==================== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Featured Deals</h2>
              <p className="text-gray-500">Hand-picked properties with the biggest savings.</p>
            </div>
            <Link href="/search" className="hidden sm:flex items-center gap-1 text-brand-500 font-semibold hover:text-brand-700 transition-colors">
              View All
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>

          {loadingFeatured ? (
            /* Loading skeletons */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100">
                  <div className="h-48 skeleton" />
                  <div className="p-4 space-y-3">
                    <div className="h-6 w-24 skeleton rounded" />
                    <div className="h-4 w-full skeleton rounded" />
                    <div className="h-4 w-3/4 skeleton rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredListings.length > 0 ? (
            /* Live listings */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredListings.map((p) => {
                const savings = p.original_price ? Math.round(((p.original_price - p.price) / p.original_price) * 100) : 0;
                const imgSrc = p.image_urls?.[0] || null;
                return (
                  <Link key={p.id} href={`/property/${p.id}`}>
                    <div className="property-card bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 cursor-pointer">
                      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        {imgSrc ? (
                          <img src={imgSrc} alt={p.title || ''} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                        )}
                        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${typeColors[p.listing_type] || 'bg-gray-100 text-gray-700'}`}>
                          {typeLabels[p.listing_type] || p.listing_type}
                        </span>
                        {savings > 0 && (
                          <div className="absolute top-3 right-3 savings-badge bg-emerald-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg">
                            Save {savings}%
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-2xl font-bold text-brand-700">{formatPrice(p.price)}</span>
                          {p.original_price && <span className="text-sm text-gray-400 line-through">{formatPrice(p.original_price)}</span>}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                          {p.bedrooms !== null && <span><span className="font-medium text-gray-700">{p.bedrooms}</span> bed</span>}
                          {p.bathrooms !== null && <span><span className="font-medium text-gray-700">{p.bathrooms}</span> bath</span>}
                          {p.sqft && <span><span className="font-medium text-gray-700">{p.sqft?.toLocaleString()}</span> sqft</span>}
                        </div>
                        <h3 className="font-semibold text-gray-800 text-sm mb-1">{p.title}</h3>
                        <p className="text-gray-500 text-sm">{p.city}, {p.state}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            /* Empty state — no listings yet */
            <div className="text-center py-16">
              <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Listings Coming Soon</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                Our aggregator is actively collecting affordable homes from across the country. Check back shortly for live deals!
              </p>
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Link href="/search" className="text-brand-500 font-semibold">View All Listings &rarr;</Link>
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Three simple steps to finding your next deal.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Browse Listings', desc: 'Search thousands of affordable homes by state, price, type, and bedrooms. New listings added every 4 hours.', icon: '🔍' },
              { step: '02', title: 'Compare Deals', desc: 'See original prices, savings percentages, and property details. Filter to find the best value for your budget.', icon: '📊' },
              { step: '03', title: 'View Source', desc: 'Click through to the original listing source to contact the seller, place a bid, or start the buying process.', icon: '🏡' },
            ].map((item, i) => (
              <div key={i} className="relative bg-white rounded-xl p-8 border border-gray-100 shadow-sm text-center">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  {item.step}
                </div>
                <div className="text-4xl mb-4 mt-2">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== BROWSE BY STATE ==================== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Browse by State</h2>
            <p className="text-gray-500">Affordable homes available in all 50 states.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {Object.entries(US_STATES).map(([abbr, name]) => (
              <Link
                key={abbr}
                href={`/search?state=${abbr}`}
                className="state-pill px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-brand-500 hover:text-white"
              >
                {abbr}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="hero-gradient py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Find Your Next Deal?</h2>
          <p className="text-blue-200 text-lg mb-8 max-w-xl mx-auto">
            Thousands of affordable homes updated daily. Start searching now — it&apos;s completely free.
          </p>
          <Link
            href="/search"
            className="cta-button inline-flex items-center gap-2 bg-white text-brand-700 px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
          >
            Search Homes Now
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
