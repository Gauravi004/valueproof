export type SupportedLanguage = 'en' | 'hi' | 'pa' | 'mr' | 'bn' | 'gu' | 'ta' | 'te';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  subtext: string;
  greeting: string;
}

export type PropertyType = 'house' | 'plot' | 'apartment' | 'shop';
export type Intent = 'sell' | 'buy';
export type AreaUnit = 'sqft' | 'gaj' | 'guntha' | 'bigha';
export type PropertyAge = 'new' | '1_5' | '5_10' | '10_20' | '20_plus';
export type RoadWidth = '15ft' | '20ft' | '30ft' | '40ft' | '60ft';

export interface PropertyInputState {
  intent: Intent; // 'sell' or 'buy'
  location: string;
  localityPincode?: string;
  propertyType: PropertyType;
  area: number;
  areaUnit: AreaUnit;
  age: PropertyAge;
  roadWidth: RoadWidth;
  bedrooms: number;
  isCornerPlot: boolean;
  dealerQuote?: number; // For buyer: seller's asked price to check
}

export interface PriceBreakdownItem {
  id: string;
  labelKey: string;
  labelFallback: string;
  amount: number;
  type: 'base' | 'positive' | 'negative' | 'total';
  explanation: string;
  tag?: string;
}

export interface ComparableProperty {
  id: string;
  title: string;
  locality: string;
  distanceKm: number;
  areaSqFt: number;
  propertyType: PropertyType;
  salePrice: number;
  ratePerSqFt: number;
  registrationDate: string;
  source: string;
  similarityScore: number;
  imageUrl?: string;
  keyFeatures: string[];
}

export interface AmenityInfo {
  name: string;
  category: string;
  distance: string;
  impactScore: string;
}

export interface CalculationStep {
  stepNumber: number;
  title: string;
  explanation: string;
  formula: string;
  value: string;
}

export interface ValuationResponse {
  id: string;
  intent: Intent;
  estimatedValueMin: number;
  estimatedValueMax: number;
  estimatedValueMid: number;
  ratePerSqFt: number;
  circleRatePerSqFt: number;
  evidenceStrength: 'High' | 'Very High' | 'Moderate';
  confidenceScore: number;
  comparableCount: number;
  locationSignals: string[];
  price_breakdown: PriceBreakdownItem[];
  comparables: ComparableProperty[];
  amenities: AmenityInfo[];
  calculations: CalculationStep[];
  limitations: string[];
  generatedAt: string;
  propertySummary: {
    location: string;
    propertyType: PropertyType;
    areaSqFt: number;
    areaOriginal: string;
    age: PropertyAge;
    roadWidth: RoadWidth;
    isCornerPlot: boolean;
    bedrooms: number;
    intent: Intent;
  };
}

export type RenovationType = 'kitchen_bath' | 'paint_flooring' | 'extra_room' | 'facade' | 'full_makeover';

export interface RenovationRequest {
  currentValue: number;
  renovationCost: number;
  renovationType: RenovationType;
}

export interface RenovationResponse {
  currentValue: number;
  renovationCost: number;
  renovationType: RenovationType;
  potentialValueChange: number;
  potentialPostRenovationValue: number;
  potentialNetDifference: number;
  roiPercentage: number;
  disclaimer: string;
  breakdownFactors: { factor: string; boost: number }[];
}

export type AppStep =
  | 'home'
  | 'language'
  | 'intent'
  | 'intake'
  | 'analysis'
  | 'valuation'
  | 'why_price'
  | 'evidence_passport'
  | 'negotiation'
  | 'renovation';
