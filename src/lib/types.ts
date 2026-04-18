// src/lib/types.ts — Consolidated types for CheapHouseHub

export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  listing_type: string;
  source: string;
  url: string;
  image_url: string | null;
  description: string | null;
  savings_pct: number | null;
  lat: number | null;
  lng: number | null;
  created_at: string;
  updated_at: string;

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
