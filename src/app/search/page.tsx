// ============================================================
// FILE: src/app/search/page.tsx
// ============================================================
'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { PropertyCard } from '@/components/PropertyCard';
import { SearchFilters } from '@/components/SearchFilters';
import { Property } from '@/lib/types';

function SearchContent() {
  const searchParams = useSearchParams();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter state
  const [stateFilter, setStateFilter] = useState(searchParams.get('state') || '');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  // Available filter options from API
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);

  // Build the API URL from current filters
  const buildApiUrl = useCallback((page: number = 1) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('query', searchQuery);
    if (stateFilter) params.set('state', stateFilter);
    if (typeFilter) params.set('listing_type', typeFilter);
    if (minPrice) params.set('min_price', minPrice);
    if (maxPrice) params.set('max_price', maxPrice);
    if (bedrooms) params.set('min_beds', bedrooms);
    if (sortBy) params.set('sort_by', sortBy);
    params.set('page', String(page));
    params.set('per_page', '24');
    return `/api/listings?${params.toString()}`;
  }, [stateFilter, typeFilter, minPrice, maxPrice, bedrooms, sortBy, searchQuery]);

  // Fetch listings from API
  const fetchListings = useCallback((page: number = 1) => {
    setLoading(true);
    fetch(buildApiUrl(page))
      .then((r) => r.json())
      .then((data) => {
        if (data.properties) {
          setProperties(data.properties);
          setTotalResults(data.total || 0);
          setCurrentPage(data.page || 1);
          setTotalPages(data.totalPages || 1);
        } else {
          setProperties([]);
          setTotalResults(0);
          setTotalPages(1);
        }
        // Load available filter options
        if (data.filters) {
          setAvailableStates(data.filters.states || []);
          setAvailableTypes(data.filters.listing_types || []);
        }
      })
      .catch(() => {
        setProperties([]);
        setTotalResults(0);
      })
      .finally(() => setLoading(false));
  }, [buildApiUrl]);

  // Sync URL search params on mount
  useEffect(() => {
    const state = searchParams.get('state');
    const type = searchParams.get('type');
    const q = searchParams.get('q');
    if (state) setStateFilter(state);
    if (type) setTypeFilter(type);
    if (q) setSearchQuery(q);
  }, [searchParams]);

  // Fetch whenever filters or sort change
  useEffect(() => {
    fetchListings(1);
  }, [stateFilter, typeFilter, minPrice, maxPrice, bedrooms, sortBy, searchQuery, fetchListings]);

  const handlePageChange = (page: number) => {
    fetchListings(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-brand-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">Search Affordable Homes</h1>
          <p className="text-blue-200">
            {loading ? 'Searching...' : `${totalResults} ${totalResults === 1 ? 'property' : 'properties'} found`}
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
              states={availableStates}
              listingTypes={availableTypes}
              onFilter={(filters) => {
                setSearchQuery(filters.query);
                setStateFilter(filters.state);
                setTypeFilter(filters.listing_type);
                setMinPrice(filters.min_price);
                setMaxPrice(filters.max_price);
                setBedrooms(filters.min_beds);
                setSortBy(filters.sort_by);
              }}
            />
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Sort bar */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-500">
                {loading ? '...' : `${totalResults} results`}
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
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
                      <div className="h-6 w-24 skeleton rounded" />
                      <div className="h-4 w-full skeleton rounded" />
                      <div className="h-4 w-3/4 skeleton rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : properties.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {properties.map((p) => (
                    <PropertyCard key={p.id} property={p} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-10">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                        let pageNum: number;
                        if (totalPages <= 7) {
                          pageNum = i + 1;
                        } else if (currentPage <= 4) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 3) {
                          pageNum = totalPages - 6 + i;
                        } else {
                          pageNum = currentPage - 3 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                              pageNum === currentPage
                                ? 'bg-brand-500 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
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
