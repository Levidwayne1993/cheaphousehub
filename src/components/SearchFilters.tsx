// src/components/SearchFilters.tsx
'use client';

import { useState } from 'react';

interface FilterProps {
  states: string[];
  listingTypes: string[];
  onFilter: (filters: {
    query: string;
    state: string;
    listing_type: string;
    min_price: string;
    max_price: string;
    min_beds: string;
    sort_by: string;
  }) => void;
}

// Named export so search/page.tsx can do { SearchFilters }
export function SearchFilters({ states, listingTypes, onFilter }: FilterProps) {
  const [query, setQuery] = useState('');
  const [state, setState] = useState('');
  const [listingType, setListingType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minBeds, setMinBeds] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter({
      query,
      state,
      listing_type: listingType,
      min_price: minPrice,
      max_price: maxPrice,
      min_beds: minBeds,
      sort_by: sortBy,
    });
  };

  const handleReset = () => {
    setQuery('');
    setState('');
    setListingType('');
    setMinPrice('');
    setMaxPrice('');
    setMinBeds('');
    setSortBy('newest');
    onFilter({
      query: '',
      state: '',
      listing_type: '',
      min_price: '',
      max_price: '',
      min_beds: '',
      sort_by: 'newest',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 mb-8">
      {/* Main search row */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by city, state, zip, or address..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
        >
          <option value="">All States</option>
          {states.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={listingType}
          onChange={(e) => setListingType(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
        >
          <option value="">All Types</option>
          {listingTypes.map((t) => (
            <option key={t} value={t}>{t.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
          ))}
        </select>
        <button
          type="submit"
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </div>

      {/* Toggle advanced filters */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {showAdvanced ? 'Hide Filters' : 'More Filters'}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Reset All
        </button>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
            <input
              type="number"
              placeholder="$0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
            <input
              type="number"
              placeholder="No max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Beds</label>
            <select
              value={minBeds}
              onChange={(e) => setMinBeds(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="savings">Best Savings</option>
            </select>
          </div>
        </div>
      )}
    </form>
  );
}

// Default export so listings/page.tsx can do: import SearchFilters from '...'
export default SearchFilters;
