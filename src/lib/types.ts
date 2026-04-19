// src/lib/types.ts — Consolidated types matching ACTUAL Supabase schema

export interface Property {
  id: string;
  title: string | null;
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
  property_type: string | null;
  listing_type: string;
  description: string | null;
  source: string;
  source_url: string | null;
  image_urls: string[];
  lat: number | null;
  lng: number | null;
  savings_pct: number | null;
  scraped_at: string;
  created_at: string;
  updated_at: string;
  imported_at: string | null;
  is_active: boolean;
  external_id: string | null;
  pushed: boolean;
  pushed_at: string | null;
  county: string | null;
  starting_bid: number | null;
  assessed_value: number | null;
  year_built: number | null;
  listing_category: string | null;
  auction_date: string | null;
  case_number: string | null;
  parcel_id: string | null;
  property_status: string | null;

  // Pillar 1: Enhanced Property Data
  days_on_market: number | null;
  price_history: any | null;

  // Pillar 2: Distress Indicators
  foreclosure_status: string | null;
  pre_foreclosure_date: string | null;
  tax_lien_amount: number | null;
  code_violations: any | null;

  // Pillar 3: Valuation
  estimated_value: number | null;
  zestimate: number | null;
  redfin_estimate: number | null;
  price_per_sqft: number | null;
  rental_value: number | null;
  cap_rate: number | null;
  arv: number | null;

  // Pillar 4: Seller Motivation
  price_drop_count: number;
  price_drop_pct: number | null;
  vacancy_status: string | null;
  absentee_owner: boolean;
  out_of_state_owner: boolean;
  probate_flag: boolean;

  // Pillar 5: Neighborhood
  crime_score: number | null;
  school_rating: number | null;
  walk_score: number | null;
  transit_score: number | null;
  bike_score: number | null;
  population_growth: number | null;
  job_growth_pct: number | null;
  rent_demand: number | null;

  // Pillar 6: Renovation
  roof_age: number | null;
  hvac_age: number | null;
  permit_count: number;
  last_permit_date: string | null;
  foundation_issues: boolean;

  // Pillar 7: Early Detection
  filing_date: string | null;
  filing_type: string | null;
  alert_priority: string;
  detection_source: string | null;
}

export interface StatsData {
  total_listings: number;
  avg_price: number;
  states_covered: number;
  avg_savings: number;
  listing_types: { type: string; count: number }[];
  recent_listings: Property[];
}

export interface SearchFilters {
  query: string;
  state: string;
  listing_type: string;
  min_price: string;
  max_price: string;
  min_beds: string;
  sort_by: string;
}

// ─── LISTING_TYPES used by page.tsx Browse by Category ───
export const LISTING_TYPES = [
  { value: 'foreclosure', label: 'Foreclosure', icon: '\uD83C\uDFDA\uFE0F' },
  { value: 'auction', label: 'Auction', icon: '\uD83D\uDD28' },
  { value: 'tax-lien', label: 'Tax Lien', icon: '\uD83D\uDCCB' },
  { value: 'bank-owned', label: 'Bank Owned', icon: '\uD83C\uDFE6' },
  { value: 'short-sale', label: 'Short Sale', icon: '\uD83D\uDCC9' },
  { value: 'cheap', label: 'Budget Home', icon: '\uD83C\uDFE1' },
];

// ─── US_STATES used by page.tsx Browse by State ───
export const US_STATES: Record<string, string> = {
  AL: 'Alabama',
  AK: 'Alaska',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
};

// ─── formatPrice used by page.tsx Featured Deals ───
export function formatPrice(price: number | null | undefined): string {
  if (price == null) return 'N/A';
  if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
  if (price >= 1000) return `$${(price / 1000).toFixed(0)}k`;
  return `$${price.toLocaleString()}`;
}
