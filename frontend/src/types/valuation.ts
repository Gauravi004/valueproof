export type PropertyType =
  | 'independent_house'
  | 'residential_plot'
  | 'apartment'
  | 'villa'
  | 'commercial_property';

export type PropertyCondition =
  | 'new'
  | 'excellent'
  | 'good'
  | 'fair'
  | 'poor'
  | 'needs_renovation';

export type IntentType = 'buy' | 'sell';

export interface PropertyLocation {
  city: string;
  locality: string;
  latitude?: number | null;
  longitude?: number | null;
  pincode?: string | null;
}

export interface PropertyInput {
  location: PropertyLocation;
  property_type: PropertyType;
  area_sqft: number;
  age_years: number;
  road_width_ft: number;
  bedrooms?: number | null;
  bathrooms?: number | null;
  corner_plot: boolean;
  floor?: number | null;
  condition: PropertyCondition;
  intent: IntentType;
}

export interface ScoredComparable {
  id: string;
  source: string;
  source_type: string;
  date: string;
  locality: string;
  city: string;
  property_type: string;
  area_sqft: number;
  price: number;
  price_per_sqft: number;
  latitude?: number | null;
  longitude?: number | null;
  age_years: number;
  road_width_ft: number;
  corner_plot: boolean;
  condition: string;
  similarity_score: number;
  distance_km?: number | null;
  selection_reasons: string[];
  is_synthetic: boolean;
}

export interface ValuationAdjustment {
  category: string;
  description: string;
  amount_inr: number;
  percentage_impact: number;
  is_positive: boolean;
}

export interface ValuationRange {
  low: number;
  mid: number;
  high: number;
  spread_percentage: number;
  spread_rationale: string;
}

export interface EvidenceStrength {
  score: number;
  label: 'Strong' | 'Moderate' | 'Limited' | 'Insufficient';
  reasons: string[];
}

export interface EvidencePassport {
  sources_summary: string[];
  total_records_analyzed: number;
  records_used_in_valuation: number;
  calculation_steps: string[];
  limitations: string[];
  evidence_strength: EvidenceStrength;
  generated_at: string;
  is_synthetic_dataset: boolean;
}

export interface LocationSignal {
  category: string;
  title: string;
  rating: string;
  score: number;
  distance_km?: number | null;
  detail: string;
  is_direct_price_factor: boolean;
}

export interface LocationIntelligence {
  city: string;
  locality: string;
  provider: string;
  is_demo: boolean;
  overall_liveability_score: number;
  signals: LocationSignal[];
  contextual_summary: string;
  direct_valuation_notes: string[];
  limitations: string[];
}

export interface NegotiationAnalysis {
  asking_price: number;
  range_low: number;
  estimated_mid: number;
  range_high: number;
  position: 'above_range' | 'within_range' | 'below_range';
  difference_from_mid: number;
  difference_from_bound: number;
  percent_variance_from_mid: number;
  summary: string;
  evidence_points: string[];
  disclaimer: string;
}

export interface RenovationScenario {
  current_estimated_value: number;
  renovation_cost: number;
  potential_value_uplift: number;
  potential_post_renovation_value: number;
  potential_net_gain: number;
  roi_percentage: number;
  scope_description: string;
  calculation_notes: string[];
  disclaimer: string;
}

export interface ValuationResult {
  property_input: PropertyInput;
  estimated_value: number;
  valuation_range: ValuationRange;
  representative_price_per_sqft: number;
  base_comparable_value: number;
  price_breakdown: ValuationAdjustment[];
  total_positive_adjustments: number;
  total_negative_adjustments: number;
  selected_comparables: ScoredComparable[];
  total_records_analyzed: number;
  location_intelligence: LocationIntelligence;
  evidence_passport: EvidencePassport;
  negotiation_lens?: NegotiationAnalysis | null;
  renovation_preview?: RenovationScenario | null;
  ai_explanation: string;
  explanation_source: 'gemini' | 'deterministic_engine';
}
