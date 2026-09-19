# MoolyaSetu — Evidence & Comparables Data Layer

> [!CAUTION]
> **CRITICAL DATA-INTEGRITY & PROVENANCE GUARANTEE**
>
> **Every row of data provided by this service is strictly synthetic and generated for demonstration and prototype purposes. It is NEVER to be presented as official government, sub-registrar, circle rate, or National Generic Document Registration System (NGDRS) data.**
>
> - Every CSV row contains a `source` column with the value `"DEMO"`.
> - Every API response carries `"source_type": "demo"` (or `"mixed"` if external rows are present) and the explicit disclaimer:
>   `"Illustrative demo data generated for prototype purposes. Not sourced from any government registry or transaction record."`
> - Source type is dynamically evaluated per row so production data pipelines can be integrated seamlessly without breaking client contracts.

---

## 1. Role & Architectural Boundaries

MoolyaSetu is a fair-value discovery tool for property in non-metro India, anchored on the demo town of **Rajpura, Punjab**.

This service (`data-layer`) acts exclusively as the **transparent evidence layer**:
- **In Scope**:
  - In-memory CSV datasets for transactions, listings, amenities, and locality features.
  - Haversine distance computations from coordinates and locality centroids.
  - Multi-factor filtering (area window, geographic radius, recency).
  - Progressive relaxation when matches are thin (`< 3`).
  - Transparent similarity scoring broken down into area closeness, distance proximity, and recency components.
  - Purely descriptive observed statistics (`min`, `median`, `max` price per sqft).
  - Data availability indicators (`good`, `moderate`, `limited`).
- **Strictly Out of Scope**:
  - **NO** valuation algorithms, midpoint estimates, predicted prices, or recommended ranges (owned downstream by the valuation engine).
  - **NO** machine learning models, confidence scoring, or automated appraisal.
  - **NO** frontend UI, LLM calls, n8n workflows, or authentication.

---

## 2. Directory Structure

```
data-layer/
├── data/
│   ├── transactions.csv         # 180 rows (TX001-TX180, 2023-01-01 to 2026-09-01)
│   ├── listings.csv             # 140 rows (LS001-LS140, asking prices above sales)
│   ├── amenities.csv            # 50 rows (schools, hospitals, markets, transit, food)
│   └── locality_features.csv    # 6 rows (counts strictly match amenities.csv)
├── app/
│   ├── __init__.py
│   ├── main.py                  # FastAPI app with CORS and lifespan loader
│   ├── loader.py                # In-memory pandas store and strict CSV validation
│   ├── models.py                # Pydantic v2 schemas and response contracts
│   ├── geo.py                   # Haversine distance and centroid coordinate lookup
│   └── routers/
│       ├── __init__.py
│       ├── comparables.py       # GET /api/comparables (ranking & relaxation)
│       ├── amenities.py         # GET /api/amenities (haversine sorting & counts)
│       ├── locality.py          # GET /api/locality (12-month observed market context)
│       └── trends.py            # GET /api/price-trend, /api/data-quality, /api/meta, /health
├── scripts/
│   └── generate_demo_data.py    # Deterministic (seed=42) generator for all 4 CSVs
├── tests/
│   ├── __init__.py
│   └── test_api.py              # Pytest suite testing all endpoints, edge cases, and hero demo
├── requirements.txt
└── README.md
```

---

## 3. Installation & Running

### Prerequisites
- Python 3.11+
- Virtual environment (`venv`)

### Setup Instructions

```bash
# 1. Navigate to data-layer
cd data-layer

# 2. Create virtual environment
python -m venv .venv

# 3. Activate virtual environment
# Windows PowerShell:
.venv\Scripts\Activate.ps1
# Linux/macOS:
source .venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. (Optional) Regenerate datasets deterministically
python scripts/generate_demo_data.py

# 6. Run test suite
pytest -v tests/test_api.py

# 7. Start the API server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Interactive OpenAPI documentation is available at `http://localhost:8000/docs`.

---

## 4. Endpoints & API Reference

### 1. `GET /health`
Returns service operational status and loaded dataset row counts.

**Example Request**:
```bash
curl -X GET "http://localhost:8000/health"
```

**Sample Response**:
```json
{
  "status": "ok",
  "rows": {
    "transactions": 180,
    "listings": 140,
    "amenities": 50,
    "locality_features": 6
  },
  "source_type": "demo",
  "disclaimer": "Illustrative demo data generated for prototype purposes. Not sourced from any government registry or transaction record."
}
```

---

### 2. `GET /api/meta`
Provides valid localities, property types, amenity types, date range, and data source breakdown for frontend dropdowns.

**Example Request**:
```bash
curl -X GET "http://localhost:8000/api/meta"
```

---

### 3. `GET /api/comparables`
Filters and ranks comparable transactions and listings based on a transparent similarity formula.

**Query Parameters**:
- `location` (required): Locality name (e.g. `Rajpura`) or `lat,lon`.
- `property_type` (required): `plot`, `flat`, `independent_house`, `shop`, `agricultural_land`.
- `area` (required): Subject property area in sqft.
- `area_tolerance` (default `0.25`): Tolerance window fraction `[area*(1-tol), area*(1+tol)]`.
- `radius_km` (default `5.0`): Spatial search radius in km.
- `months` (default `24`): Recency window in months.
- `limit` (default `10`, max `50`): Maximum results to return.
- `include_listings` (default `true`): Include active listings alongside transactions.

**Scoring Components**:
- Area Closeness: `max(0, 1 - (|area - subject_area| / (0.5 * subject_area)))` (Weight: 40%)
- Geographic Proximity: `max(0, 1 - (dist_km / max_dist))` (Weight: 35%)
- Recency: `max(0, 1 - (days_old / max_days))` (Weight: 25%)

**Progressive Relaxation**:
If fewer than 3 matches are found, the service automatically relaxes `area_tolerance` (up to 0.50) and `radius_km` (up to 15 km), recording all changes in `relaxations_applied`.

**Example Request (Hero Demo)**:
```bash
curl -X GET "http://localhost:8000/api/comparables?location=Rajpura&property_type=independent_house&area=1800"
```

**Sample Response Snippet**:
```json
{
  "subject": {
    "location": "Rajpura",
    "resolved_name": "Rajpura",
    "property_type": "independent_house",
    "area_sqft": 1800.0,
    "area_tolerance": 0.25,
    "radius_km": 5.0,
    "months": 24,
    "limit": 10,
    "include_listings": true
  },
  "count": 10,
  "source_type": "demo",
  "disclaimer": "Illustrative demo data generated for prototype purposes. Not sourced from any government registry or transaction record.",
  "relaxations_applied": [],
  "evidence_summary": {
    "transactions": 6,
    "listings": 4,
    "observed_price_per_sqft": {
      "min": 2720.0,
      "median": 2860.0,
      "max": 3040.0
    }
  },
  "comparables": [
    {
      "id": "TX004",
      "record_type": "transaction",
      "date": "2026-04-12",
      "locality": "Rajpura",
      "property_type": "independent_house",
      "area_sqft": 1800.0,
      "price": 5130000.0,
      "price_per_sqft": 2850.0,
      "latitude": 30.4852,
      "longitude": 76.5960,
      "distance_km": 0.21,
      "age_years": null,
      "road_width_ft": null,
      "similarity_score": 0.951,
      "score_components": {
        "area": 1.0,
        "distance": 0.972,
        "recency": 0.845
      },
      "source": "DEMO"
    }
  ]
}
```

---

### 4. `GET /api/amenities`
Finds nearby civic infrastructure using real Haversine distance, sorted closest first.

**Query Parameters**:
- `location` OR (`latitude` + `longitude`) (required)
- `type` (optional, repeatable): `school`, `hospital`, `market`, `highway`, `railway`, `bank`, `park`, `food`, `retail`
- `radius_km` (default `5.0`)
- `limit` (default `25`)

**Example Request**:
```bash
curl -X GET "http://localhost:8000/api/amenities?location=Rajpura&type=school&type=hospital"
```

---

### 5. `GET /api/locality`
Returns locality features (synced with amenities) and descriptive 12-month market statistics per property type. Returns 404 with known localities if unknown.

**Query Parameters**:
- `locality` (optional, omit for all 6 localities)

**Example Request**:
```bash
curl -X GET "http://localhost:8000/api/locality?locality=Rajpura"
```

---

### 6. `GET /api/price-trend`
Powers the historical price trend chart using transaction observations. Flags thin years (`<3` transactions) with `"sparse": true`.

**Query Parameters**:
- `locality` (required)
- `property_type` (optional)
- `years` (default `4`)

**Example Request**:
```bash
curl -X GET "http://localhost:8000/api/price-trend?locality=Rajpura&property_type=independent_house&years=4"
```

---

### 7. `GET /api/data-quality`
Powers the frontend Data Availability panel with heuristic quality metrics.

**Heuristic Thresholds**:
- **Limited**: `< 5` total comparables (`"⚠️ Limited data"`)
- **Moderate**: `5–9` total comparables
- **Good**: `≥ 10` total comparables (`"✅ Good evidence support"`)

> [!NOTE]
> These thresholds represent a prototype heuristic to provide immediate visual feedback during demonstrations, not a calibrated statistical sample size.

**Example Request**:
```bash
curl -X GET "http://localhost:8000/api/data-quality?location=Rajpura&property_type=independent_house&area=1800"
```

---

## 5. Demo Walkthrough Script

Use this sequence of API calls during the live demonstration:

### Step 1: Health & Meta Setup
```bash
curl -X GET "http://localhost:8000/health"
curl -X GET "http://localhost:8000/api/meta"
```
*Shows clean startup, 180 transactions, 140 listings, and strict DEMO data labeling.*

### Step 2: Hero Case — Rajpura 1800 sqft Independent House
```bash
curl -X GET "http://localhost:8000/api/comparables?location=Rajpura&property_type=independent_house&area=1800"
```
*Returns >=10 comparables clustering in ₹47L–₹55L with transparent similarity scores (area, distance, recency) and observed stats ~₹2,700–3,000/sqft.*

### Step 3: Check Data Quality Indicator for Hero Case
```bash
curl -X GET "http://localhost:8000/api/data-quality?location=Rajpura&property_type=independent_house&area=1800"
```
*Returns `"quality": "good"` with `total_comparables >= 10`.*

### Step 4: Show the Thin-Locality State ("⚠️ Limited data")
```bash
curl -X GET "http://localhost:8000/api/data-quality?location=Sarai%20Banjara&property_type=independent_house&area=1800"
```
*Demonstrates truthful data availability: returns `"quality": "limited"` because Sarai Banjara has <=3 comparables.*

### Step 5: Nearby Infrastructure for Rajpura
```bash
curl -X GET "http://localhost:8000/api/amenities?location=Rajpura&radius_km=5.0"
```
*Returns schools, hospitals, railway station, and NH-44 highway with precise Haversine distances for map plotting.*

### Step 6: 4-Year Price Trend for Rajpura
```bash
curl -X GET "http://localhost:8000/api/price-trend?locality=Rajpura&property_type=independent_house&years=4"
```
*Returns observed average price/sqft showing the 8–11% yearly growth story from 2023 to 2026.*
