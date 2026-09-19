# ValueProof System Architecture

**Tagline: Evidence before price.**

ValueProof is an India-first property valuation and decision-support platform built with a strict separation between deterministic financial calculation and AI explanation.

```
+-----------------------------------------------------------------------------------+
|                            ValueProof Architecture Flow                           |
+-----------------------------------------------------------------------------------+

   [ Next.js 15+ Frontend ] (TypeScript, Tailwind CSS, Lucide Icons, Responsive)
             |
             |  REST API calls (JSON)
             v
   [ FastAPI Backend (Python) ]
             |
             +---> 1. Property Schema & Input Validation (Pydantic V2)
             |
             +---> 2. Comparable Intelligence Engine (Multi-Factor Transparent Scoring)
             |        - Geographic distance (Haversine km)
             |        - Property type compatibility
             |        - Area ratio similarity
             |        - Vintage & road width similarity
             |        - Recency & source credibility
             |
             +---> 3. Deterministic Valuation Engine (Core Truth)
             |        - Representative unit rate (₹/sqft)
             |        - Base value = rate × subject area
             |        - Documented adjustments (corner plot, wide road, condition, age)
             |        - Dispersion-based valuation range (Low, Mid, High)
             |
             +---> 4. Location Intelligence Module (Modular Provider)
             |        - Direct factors vs Contextual signals (Schools, Hospitals, Transit, AQI)
             |
             +---> 5. Evidence Passport Builder
             |        - Audit trail & step-by-step calculations
             |        - Deterministic evidence strength score (0-100)
             |        - Explicit limitation & synthetic disclosures
             |
             +---> 6. Decision Support Modules
             |        - Negotiation Lens (Asking price vs Evidence corridor)
             |        - Renovation Scenario Simulator (Uplift projections)
             |
             +---> 7. Gemini Explanation Layer
                      - Strictly explains structured evidence
                      - Never alters numbers or invents facts
                      - Graceful deterministic fallback if API is unavailable
```

## Core Architectural Principles

1. **Deterministic Core Truth**:
   The valuation engine calculates exact mathematical figures based on empirical transaction records and documented adjustments. Neither Google Gemini nor n8n is ever allowed to be the source of truth for numbers.

2. **No Hallucinated Adjustments**:
   Amenities such as schools and hospitals provide buyer confidence and contextual sentiment. They do not inject arbitrary rupee multipliers unless supported by documented infrastructure parameters (e.g. road width).

3. **Multi-tier Fallbacks**:
   - If Gemini is absent or fails -> Pure deterministic natural-language generator activates.
   - If GPS coordinates are omitted -> Locality and municipal fuzzy clustering activate.
   - If external mapping APIs are offline -> DemoLocationProvider activates.

4. **Modular Provider Abstraction**:
   Location services implement `BaseLocationProvider`, enabling seamless swapping between demo mock data and live geospatial APIs (Mapbox, Google Places, OpenStreetMap) without altering core valuation logic.
