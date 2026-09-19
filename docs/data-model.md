# ValueProof Data Model & Schemas

## 1. Comparable Property Schema
Represents recorded transactions and verified listings:

```typescript
interface ComparableProperty {
  id: string;                      // e.g. "COMP-RAJ-001"
  source: string;                  // e.g. "DEMO / SYNTHETIC / ILLUSTRATIVE DATA - Punjab Land Records Mock"
  source_type: string;             // "government_registry_mock" | "verified_listing_mock" | "market_index_mock"
  date: string;                    // ISO Date YYYY-MM-DD
  locality: string;                // e.g. "Focal Point Road"
  city: string;                    // e.g. "Rajpura"
  property_type: string;           // "independent_house" | "residential_plot" | "apartment" | "villa" | "commercial_property"
  area_sqft: number;               // strictly positive
  price: number;                   // in INR
  price_per_sqft: number;          // price / area_sqft
  latitude: number | null;
  longitude: number | null;
  age_years: number;
  road_width_ft: number;
  bedrooms: number | null;
  bathrooms: number | null;
  corner_plot: boolean;
  condition: string;               // "new" | "excellent" | "good" | "fair" | "poor" | "needs_renovation"
  is_synthetic: boolean;           // Always true for demo datasets
}
```

## 2. Subject Property Input Schema
```typescript
interface PropertyInput {
  location: {
    city: string;
    locality: string;
    latitude?: number | null;
    longitude?: number | null;
    pincode?: string | null;
  };
  property_type: "independent_house" | "residential_plot" | "apartment" | "villa" | "commercial_property";
  area_sqft: number;               // > 0
  age_years: number;               // >= 0
  road_width_ft: number;           // >= 0
  bedrooms?: number | null;
  bathrooms?: number | null;
  corner_plot: boolean;
  floor?: number | null;
  condition: "new" | "excellent" | "good" | "fair" | "poor" | "needs_renovation";
  intent: "buy" | "sell";
}
```

## 3. Evidence Passport Schema
```typescript
interface EvidencePassport {
  sources_summary: string[];
  total_records_analyzed: number;
  records_used_in_valuation: number;
  calculation_steps: string[];
  limitations: string[];
  evidence_strength: {
    score: number;                // 0 to 100
    label: "Strong" | "Moderate" | "Limited" | "Insufficient";
    reasons: string[];
  };
  generated_at: string;
  is_synthetic_dataset: boolean;
}
```
