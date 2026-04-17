'use client';

import Link from 'next/link';
import { Property, formatPrice, calcSavings } from '@/lib/types';

interface PropertyCardProps {
  property: Property;
}

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

export function PropertyCard({ property }: PropertyCardProps) {
  const savings = calcSavings(property.price, property.original_price);
  const imgSrc = property.image_urls?.[0] || null;
  const typeColor = typeColors[property.listing_type] || 'bg-gray-100 text-gray-700';
  const typeLabel = typeLabels[property.listing_type] || property.listing_type;

  return (
    <Link href={`/property/${property.id}`}>
      <div className="property-card bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 cursor-pointer h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={property.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          )}

          {/* Type badge */}
          <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${typeColor}`}>
            {typeLabel}
          </span>

          {/* Savings badge */}
          {savings && savings > 0 && (
            <div className="absolute top-3 right-3 savings-badge bg-emerald-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg">
              Save {savings}%
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* Price */}
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold text-brand-700">{formatPrice(property.price)}</span>
            {property.original_price && property.original_price > property.price && (
              <span className="text-sm text-gray-400 line-through">{formatPrice(property.original_price)}</span>
            )}
          </div>

          {/* Specs */}
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
            {property.bedrooms !== null && (
              <span className="flex items-center gap-1">
                <span className="font-medium text-gray-700">{property.bedrooms}</span> bed
              </span>
            )}
            {property.bathrooms !== null && (
              <span className="flex items-center gap-1">
                <span className="font-medium text-gray-700">{property.bathrooms}</span> bath
              </span>
            )}
            {property.sqft && (
              <span className="flex items-center gap-1">
                <span className="font-medium text-gray-700">{property.sqft.toLocaleString()}</span> sqft
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1">{property.title}</h3>

          {/* Location */}
          <p className="text-gray-500 text-sm mt-auto">
            {property.city}{property.state ? `, ${property.state}` : ''}{property.zip ? ` ${property.zip}` : ''}
          </p>
        </div>
      </div>
    </Link>
  );
}
