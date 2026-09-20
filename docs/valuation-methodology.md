# ValueProof Valuation Methodology

## 1. Overview
ValueProof applies a transparent, evidence-based comparable sales approach tailored to the Indian residential and commercial real estate ecosystem.

Every rupee in the final valuation is strictly traceable through seven transparent steps:

```
Subject Property Input
          ↓
Top Comparable Selection (Scoring Matrix)
          ↓
Representative Price / Sqft Derivation
          ↓
Base Comparable Value Calculation
          ↓
Documented Property Adjustments
          ↓
Estimated Property Value
          ↓
Empirical Evidence Range (Low – Mid – High)
```

---

## 2. Comparable Selection Scoring Matrix

Each record in the transaction database is evaluated against the subject property across eight criteria with centralized weights:

| Criterion | Weight | Scoring Mechanics |
| :--- | :--- | :--- |
| **Geographic Distance** | 25% | Haversine distance in km: `max(0, 1 - (km / 15))`. Falls back to exact locality (1.0) or city match (0.7) if GPS coordinates are omitted. |
| **Property Type** | 25% | Exact match = 100%; Residential crossover (Independent House vs Villa) = 75%; Apartment vs House = 40%; Mismatch = 10%. |
| **Area Footprint** | 15% | Ratio of smaller to larger area: `min(A_comp, A_sub) / max(A_comp, A_sub)`. |
| **Construction Age** | 10% | Vintage variance: `max(0, 1 - (abs(age_comp - age_sub) / 25))`. |
| **Road Frontage Width** | 10% | Passage width variance: `max(0, 1 - (abs(road_comp - road_sub) / 30))`. |
| **Recency** | 5% | Age of transaction in days: `max(0.2, 1 - (days / 365))`. |
| **Source Credibility** | 5% | Sub-Registrar / Government deed = 1.0; Verified broker listing = 0.85; Index sample = 0.70. |
| **Data Completeness** | 5% | Proportion of complete, non-null attributes present in the record. |

Top comparables (up to 6) are selected by overall similarity score.

---

## 3. Representative Unit Rate & Base Value

1. **Similarity-Weighted Unit Rate**:
   $$\text{Price/Sqft}_{\text{rep}} = \frac{\sum (c_i.\text{price\_per\_sqft} \times w_i)}{\sum w_i}$$
   where $w_i = \text{similarity\_score}_i$.

2. **Base Comparable Value**:
   $$\text{Base Value} = \text{Price/Sqft}_{\text{rep}} \times \text{Subject Area (sqft)}$$

---

## 4. Documented Adjustments

Adjustments are applied exclusively for verified physical factors:

* **Corner Plot Premium**:
  $+4.0\%$ of base value for dual-road frontage, enhanced natural light, cross-ventilation, and visibility.
* **Wide Road Access**:
  $+1.5\%$ per $10\text{ ft}$ of road width exceeding $25\text{ ft}$ (capped at $+4.5\%$).
* **Constrained Street Passage**:
  $-2.5\%$ for passage narrower than $20\text{ ft}$ due to multi-vehicle bottleneck.
* **Structural Maintenance / Condition**:
  - `New`: $+5.0\%$
  - `Excellent`: $+4.0\%$
  - `Good`: $\pm0.0\%$ (Baseline)
  - `Fair`: $-5.0\%$
  - `Poor`: $-12.0\%$
  - `Needs Renovation`: $-15.0\%$
* **Vintage Depreciation**:
  $-0.5\%$ per year of age (capped at $-20\%$). Does not apply to vacant residential plots.
* **Apartment Floor Preference**:
  Ground floor: $+1.0\%$; First & Second floors: $+2.0\%$; Third floor: $+1.0\%$.

$$\text{Estimated Value} = \text{Base Value} + \sum \text{Positive Adjustments} - \sum \text{Negative Adjustments}$$

---

## 5. Valuation Range Dispersion

The range $[\text{Low}, \text{Mid}, \text{High}]$ communicates empirical uncertainty:
- **Mid Point**: Equal to the Estimated Value.
- **Spread Margin ($\pm\%$)**: Driven by the standard deviation of comparable unit prices and calibrated by sample size and average similarity.
- When comparables are dense and homogeneous, the spread is tight ($\pm5\%$).
- When comparables are sparse or heterogeneous, the spread widens (up to $\pm15-20\%$) with explicit disclosure in the Evidence Passport.
