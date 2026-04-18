// src/components/PropertyCard.tsx
'use client';

import { Property } from '@/lib/types';

function formatPrice(price: number): string {
  if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
  if (price >= 1000) return `$${(price / 1000).toFixed(0)}k`;
  return `$${price}`;
}

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    foreclosure: 'bg-red-100 text-red-800',
    auction: 'bg-orange-100 text-orange-800',
    'tax-lien': 'bg-yellow-100 text-yellow-800',
    'bank-owned': 'bg-blue-100 text-blue-800',
    'short-sale': 'bg-purple-100 text-purple-800',
    cheap: 'bg-green-100 text-green-800',
    'hud': 'bg-indigo-100 text-indigo-800',
    'usda': 'bg-teal-100 text-teal-800',
    'homepath': 'bg-pink-100 text-pink-800',
  };
  return colors[type] || 'bg-gray-100 text-gray-800';
}

export default function PropertyCard({ property }: { property: Property }) {
  const {
    address,
    city,
    state,
    zip,
    price,
    beds,
    baths,
    sqft,
    listing_type,
    source,
    url,
    image_url,
    savings_pct,
    days_on_market,
    estimated_value,
    foreclosure_status,
  } = property;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        {image_url ? (
          <img
            src={image_url}
            alt={address}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '';
              (e.target as HTMLImageElement).className = 'hidden';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" />
            </svg>
          </div>
        )}

        {/* Listing type badge */}
        <span className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold ${getTypeColor(listing_type)}`}>
          {listing_type?.replace('-', ' ').toUpperCase() || 'LISTING'}
        </span>

        {/* Savings badge */}
        {savings_pct && savings_pct > 0 && (
          <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold bg-green-500 text-white">
            {savings_pct}% OFF
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl font-bold text-gray-900">
            ${price?.toLocaleString() || 'N/A'}
          </h3>
          {estimated_value && estimated_value > price && (
            <span className="text-sm text-gray-400 line-through">
              ${estimated_value.toLocaleString()}
            </span>
          )}
        </div>

        {/* Address */}
        <p className="text-gray-700 font-medium text-sm mb-1 truncate">{address}</p>
        <p className="text-gray-500 text-sm mb-3">{city}, {state} {zip}</p>

        {/* Details row */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          {beds != null && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v11a1 1 0 001 1h16a1 1 0 001-1V7" />
              </svg>
              {beds} bd
            </span>
          )}
          {baths != null && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
              </svg>
              {baths} ba
            </span>
          )}
          {sqft != null && (
            <span>{sqft.toLocaleString()} sqft</span>
          )}
        </div>

        {/* Extra info tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {days_on_market != null && (
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
              {days_on_market} days on market
            </span>
          )}
          {foreclosure_status && (
            <span className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded">
              {foreclosure_status}
            </span>
          )}
        </div>

        {/* Source + Link */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">via {source}</span>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              View Listing →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
