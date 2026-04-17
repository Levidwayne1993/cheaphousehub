export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  original_price: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  sqft: number | null;
  lot_size: string | null;
  property_type: string;
  listing_type: string;
  description: string;
  source: string;
  source_url: string;
  image_urls: string[];
  lat: number | null;
  lng: number | null;
  savings_pct: number | null;
  scraped_at: string;
  created_at: string;
  updated_at: string;
}

export interface SearchFilters {
  state?: string;
  listing_type?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  sort_by?: 'price_asc' | 'price_desc' | 'savings' | 'newest';
  page?: number;
  limit?: number;
  query?: string;
}

export interface SearchResult {
  properties: Property[];
  total: number;
  page: number;
  totalPages: number;
}

export interface SiteStats {
  total_listings: number;
  avg_price: number;
  avg_savings: number;
  states_covered: number;
  foreclosures: number;
  auctions: number;
  tax_liens: number;
  bank_owned: number;
}

export const US_STATES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
};

export const LISTING_TYPES = [
  { value: 'foreclosure', label: 'Foreclosures', icon: '🏚️', color: 'red' },
  { value: 'auction', label: 'Auctions', icon: '🔨', color: 'amber' },
  { value: 'tax-lien', label: 'Tax Liens', icon: '📋', color: 'purple' },
  { value: 'bank-owned', label: 'Bank Owned', icon: '🏦', color: 'blue' },
  { value: 'short-sale', label: 'Short Sales', icon: '📉', color: 'teal' },
  { value: 'cheap', label: 'Budget Homes', icon: '💰', color: 'green' },
];

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function calcSavings(price: number, originalPrice: number | null): number | null {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
