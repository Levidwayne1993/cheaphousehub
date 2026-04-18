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

export default function SearchFilters({ states, listingTypes, onFilter }: FilterProps) {
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

      {/* Toggle advanced */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-sm text-blue-600 hover:text-blue-800 mb-4"
      >
        {showAdvanced ? '▲ Hide filters' : '▼ More filters'}
      </button>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">Min Price:</label>
            <input
              type="number"
              placeholder="$0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">Max Price:</label>
            <input
              type="number"
              placeholder="$500k"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">Min Beds:</label>
            <select
              value={minBeds}
              onChange={(e) => setMinBeds(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">Sort:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="savings">Best Savings</option>
            </select>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset All
          </button>
        </div>
      )}
    </form>
  );
}
