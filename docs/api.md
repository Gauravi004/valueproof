# ValueProof REST API Reference

Base URL: `http://localhost:8000/api/v1`

All responses are serialized in standard JSON.

---

## 1. Health Check
`GET /api/v1/health`

### Response `200 OK`
```json
{
  "status": "healthy",
  "service": "ValueProof",
  "tagline": "Evidence before price.",
  "version": "1.0.0",
  "environment": "development",
  "gemini_enabled": false,
  "location_provider": "demo"
}
```

---

## 2. Core Property Valuation
`POST /api/v1/valuate`

### Request Body
```json
{
  "property": {
    "location": {
      "city": "Rajpura",
      "locality": "Focal Point Road",
      "latitude": 30.4852,
      "longitude": 76.5931
    },
    "property_type": "independent_house",
    "area_sqft": 1800,
    "age_years": 8,
    "road_width_ft": 30,
    "bedrooms": 3,
    "bathrooms": 2,
    "corner_plot": true,
    "floor": 1,
    "condition": "good",
    "intent": "sell"
  },
  "asking_price": 7500000,
  "include_ai_explanation": true
}
```

### Key Response Fields `200 OK`
* `estimated_value` *(float)*: Deterministic final valuation figure.
* `valuation_range` *(object)*: `low`, `mid`, `high`, `spread_percentage`.
* `representative_price_per_sqft` *(float)*: Weighted unit rate derived from top matching records.
* `base_comparable_value` *(float)*: `representative_price_per_sqft × area_sqft`.
* `price_breakdown` *(array)*: Positive and negative factors with rupee amounts and percentage impacts.
* `selected_comparables` *(array)*: Top comparables with similarity percentage, distance, and match reasons.
* `location_intelligence` *(object)*: Infrastructure access and contextual locality signals.
* `evidence_passport` *(object)*: Step-by-step calculations, data sources, strength score, and limitations.
* `negotiation_lens` *(object | null)*: Comparison of asking price against the evidence bounds.
* `renovation_preview` *(object | null)*: Capital expenditure vs potential equity uplift.
* `ai_explanation` *(string)*: Structured natural-language explanation strictly grounded in evidence.

---

## 3. Query Comparables
`GET /api/v1/comparables?city=Rajpura&property_type=independent_house`

### Query Parameters
* `city` *(string, optional)*
* `property_type` *(string, optional)*

Returns the full catalog of records matching the query filters, along with demo data disclosures.

---

## 4. Location Intelligence
`GET /api/v1/location?city=Rajpura&locality=Focal%20Point`

### Query Parameters
* `city` *(string, required)*
* `locality` *(string, required)*
* `latitude` *(float, optional)*
* `longitude` *(float, optional)*

---

## 5. Negotiation Lens
`POST /api/v1/negotiate`

### Request Body
```json
{
  "asking_price": 8200000,
  "estimated_mid": 7000000,
  "range_low": 6500000,
  "range_high": 7500000
}
```

---

## 6. Renovation Scenario Simulator
`POST /api/v1/renovation-scenario`

### Request Body
```json
{
  "current_estimated_value": 7000000,
  "area_sqft": 1800,
  "scope": "full_interior",
  "custom_cost": null,
  "current_condition": "good"
}
```

---

## 7. Evidence Explanation
`POST /api/v1/explain`

Synthesizes human-friendly narrative strictly bounded by provided payload via Gemini or deterministic fallback.
