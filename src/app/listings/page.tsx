// src/app/listings/page.tsx
'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';
import SearchFilters from '@/components/SearchFilters';
import { Property } from '@/lib/types';

interface ListingsResponse {
  listings: Property[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  filters: {
    states: string[];
    listing_types: string[];
  };
}

function ListingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [data, setData] = useState<ListingsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState<string[]>([]);
  const [listingTypes, setListingTypes] = useState<string[]>([]);

  const currentPage = parseInt(searchParams.get('page') || '1');

  const fetchListings = useCallback(async (params?: Record<string, string>) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();

      // Use provided params or fall back to URL search params
      const source = params || Object.fromEntries(searchParams.entries());

      Object.entries(source).forEach(([key, value]) => {
        if (value) queryParams.set(key, value);
      });

      if (!queryParams.has('page')) queryParams.set('page', '1');

      const res = await fetch(`/api/listings?${queryParams.toString()}`);
      if (res.ok) {
        const result: ListingsResponse = await res.json();
        setData(result);
        setStates(result.filters.states);
        setListingTypes(result.filters.listing_types);
      }
    } catch (err) {
      console.error('Failed to fetch listings:', err);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleFilter = (filters: Record<string, string>) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    params.set('page', '1');
    router.push(`/listings?${params.toString()}`);
    fetchListings({ ...filters, page: '1' });
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/listings?${params.toString()}`);

    const filters = Object.fromEntries(searchParams.entries());
    fetchListings({ ...filters, page: newPage.toString() });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Browse Listings</h1>
          <p className="text-blue-200">
            {loading ? 'Loading...' : `${data?.total || 0} properties found`}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search & Filters */}
        <SearchFilters
          states={states}
          listingTypes={listingTypes}
          onFilter={handleFilter}
        />

        {/* Listings Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md h-80 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-xl" />
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : data?.listings && data.listings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.listings.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* Pagination */}
            {data.total_pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ← Previous
                </button>

                {Array.from({ length: Math.min(data.total_pages, 7) }, (_, i) => {
                  let pageNum: number;
                  if (data.total_pages <= 7) {
                    pageNum = i + 1;
                  } else if (currentPage <= 4) {
                    pageNum = i + 1;
                  } else if (currentPage >= data.total_pages - 3) {
                    pageNum = data.total_pages - 6 + i;
                  } else {
                    pageNum = currentPage - 3 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        pageNum === currentPage
                          ? 'bg-blue-600 text-white font-bold'
                          : 'bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= data.total_pages}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            )}

            {/* Results info */}
            <p className="text-center text-gray-500 text-sm mt-4">
              Showing {((currentPage - 1) * (data.per_page)) + 1}–{Math.min(currentPage * data.per_page, data.total)} of {data.total} listings
            </p>
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <p className="text-xl text-gray-500 mb-2">No listings found</p>
            <p className="text-gray-400">Try adjusting your filters or run the scraper to populate data.</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading listings...</div>
      </div>
    }>
      <ListingsContent />
    </Suspense>
  );
}
