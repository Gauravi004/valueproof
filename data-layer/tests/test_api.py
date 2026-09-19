"""Comprehensive test suite for MoolyaSetu Evidence Layer.

Covers:
- Geodesic Haversine calculation against known distance
- Startup CSV validation
- Every endpoint happy path
- Unknown locality (404 with list of known localities)
- Missing required query parameters (400/422)
- Relaxation fallback mechanism (<3 matches expands tolerance/radius)
- Thin locality 'limited' data quality state (Sarai Banjara <= 3)
- Anchored hero Rajpura demo case (>= 10 comparables in ₹47L–₹55L band)
- Presence of source_type and disclaimer on EVERY endpoint response
"""

import pytest
from fastapi.testclient import TestClient
from pathlib import Path
import sys

# Ensure data-layer is on path
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from app.main import app
from app.geo import haversine_distance, resolve_coordinates
from app.loader import data_store, VALID_LOCALITIES
from app.models import DISCLAIMER_TEXT


@pytest.fixture(scope="session")
def client():
    # Trigger lifespan to load and validate CSVs
    with TestClient(app) as c:
        yield c


# ==============================================================================
# 1. GEO CALCULATIONS & HAVERSINE UNIT TESTS
# ==============================================================================

def test_haversine_accuracy():
    """Verify Haversine against known geodesic distance between Rajpura and Patiala."""
    # Rajpura: (30.4841, 76.5942), Patiala bus stand: (30.3256, 76.4022)
    dist = haversine_distance(30.4841, 76.5942, 30.3256, 76.4022)
    # Known real-world geodesic distance is ~25.2 km (+/- 0.5 km)
    assert 24.5 <= dist <= 26.0
    # Zero distance test
    assert haversine_distance(30.4841, 76.5942, 30.4841, 76.5942) == 0.0


def test_resolve_coordinates():
    """Test locality name lookup and coordinate resolution."""
    lat, lon, name = resolve_coordinates("rajpura")
    assert round(lat, 4) == 30.4841
    assert round(lon, 4) == 76.5942
    assert name == "Rajpura"

    lat2, lon2, name2 = resolve_coordinates("30.50,76.60")
    assert lat2 == 30.50
    assert lon2 == 76.60

    with pytest.raises(ValueError):
        resolve_coordinates("NonExistentCity")


# ==============================================================================
# 2. SYSTEM INTEGRITY: HEALTH, META & DATASET ROWS
# ==============================================================================

def test_health_check(client):
    """Test /health endpoint: returns ok, exact row counts, source_type, and disclaimer."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["rows"]["transactions"] == 180
    assert data["rows"]["listings"] == 140
    assert data["rows"]["amenities"] == 50
    assert data["rows"]["locality_features"] == 6
    assert data["source_type"] == "demo"
    assert data["disclaimer"] == DISCLAIMER_TEXT


def test_meta_endpoint(client):
    """Test /api/meta endpoint: returns valid localities, property types, and source breakdown."""
    response = client.get("/api/meta")
    assert response.status_code == 200
    data = response.json()
    assert set(data["localities"]) == VALID_LOCALITIES
    assert "independent_house" in data["property_types"]
    assert "school" in data["amenity_types"]
    assert data["source_type"] == "demo"
    assert data["disclaimer"] == DISCLAIMER_TEXT
    assert data["source_type_breakdown"]["DEMO"] == (180 + 140 + 50 + 6)


# ==============================================================================
# 3. HERO DEMO ANCHOR: RAJPURA INDEPENDENT HOUSE (₹47L–₹55L)
# ==============================================================================

def test_comparables_rajpura_anchor_hero_case(client):
    """Hero demo case:

    independent_house in Rajpura, 1800 sqft.
    Must return >= 10 comparables clustering in ₹47L–₹55L band.
    """
    response = client.get(
        "/api/comparables",
        params={
            "location": "Rajpura",
            "property_type": "independent_house",
            "area": 1800,
            "limit": 20,
        },
    )
    assert response.status_code == 200
    data = response.json()

    assert data["source_type"] == "demo"
    assert data["disclaimer"] == DISCLAIMER_TEXT
    assert data["count"] >= 10, f"Expected at least 10 comparables, got {data['count']}"

    comps = data["comparables"]
    assert len(comps) >= 10

    # Verify clustering: every comparable in top 10 falls within ₹47L - ₹55L
    top_10 = comps[:10]
    in_band_count = sum(1 for c in top_10 if 4700000 <= c["price"] <= 5500000)
    assert in_band_count >= 10, (
        f"Expected all top 10 comparables in ₹47L–₹55L band, but only {in_band_count}/10 were. "
        f"Prices: {[c['price'] for c in top_10]}"
    )

    # Check that rates per sqft cluster near ₹2,700–₹3,000/sqft
    obs = data["evidence_summary"]["observed_price_per_sqft"]
    assert obs is not None
    assert 2600 <= obs["min"] <= 3100
    assert 2700 <= obs["median"] <= 3100

    # Verify transparent similarity score and components on every item
    prev_score = 1.1
    for c in comps:
        assert 0.0 <= c["similarity_score"] <= 1.0
        assert 0.0 <= c["score_components"]["area"] <= 1.0
        assert 0.0 <= c["score_components"]["distance"] <= 1.0
        assert 0.0 <= c["score_components"]["recency"] <= 1.0
        assert c["similarity_score"] <= prev_score  # Ranked descending
        prev_score = c["similarity_score"]
        assert c["source"] == "DEMO"


# ==============================================================================
# 4. COMPARABLES RELAXATION FALLBACK
# ==============================================================================

def test_comparables_relaxation_fallback(client):
    """When a restrictive query matches < 3 rows initially, progressive relaxation expands tolerance."""
    # Query with tiny area tolerance (0.01) and tight radius (0.5 km) on Shambhu
    response = client.get(
        "/api/comparables",
        params={
            "location": "Shambhu",
            "property_type": "flat",
            "area": 1400,
            "area_tolerance": 0.01,
            "radius_km": 0.5,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["source_type"] == "demo"
    assert data["disclaimer"] == DISCLAIMER_TEXT
    # Must report relaxations applied
    assert len(data["relaxations_applied"]) > 0
    assert any("area_tolerance" in r or "radius_km" in r for r in data["relaxations_applied"])


# ==============================================================================
# 5. DATA QUALITY: GOOD VS THIN LOCALITY (SARAI BANJARA)
# ==============================================================================

def test_data_quality_rajpura_good(client):
    """Data quality for Rajpura hero property should be 'good' (>= 10 total comparables)."""
    response = client.get(
        "/api/data-quality",
        params={
            "location": "Rajpura",
            "property_type": "independent_house",
            "area": 1800,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["quality"] == "good"
    assert data["total_comparables"] >= 10
    assert "10" in data["thresholds_note"]
    assert data["source_type"] == "demo"
    assert data["disclaimer"] == DISCLAIMER_TEXT


def test_data_quality_sarai_banjara_limited(client):
    """Data quality for Sarai Banjara must truthfully return 'limited' (< 5 comparables)."""
    response = client.get(
        "/api/data-quality",
        params={
            "location": "Sarai Banjara",
            "property_type": "independent_house",
            "area": 1800,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["quality"] == "limited"
    assert data["total_comparables"] < 5
    assert "thin" in data["quality_reason"].lower() or "only" in data["quality_reason"].lower()
    assert data["source_type"] == "demo"
    assert data["disclaimer"] == DISCLAIMER_TEXT


# ==============================================================================
# 6. AMENITIES ENDPOINT: HAVERSINE SORTING, TYPE FILTER, AND 400 VALIDATION
# ==============================================================================

def test_amenities_happy_path(client):
    """Test amenities endpoint returns items sorted by distance ascending with type breakdown."""
    response = client.get("/api/amenities", params={"location": "Rajpura", "limit": 10})
    assert response.status_code == 200
    data = response.json()
    assert data["count"] > 0
    assert "school" in data["counts_by_type"]
    assert "school" in data["nearest_by_type"]
    assert data["source_type"] == "demo"
    assert data["disclaimer"] == DISCLAIMER_TEXT

    # Verify ascending distance order
    distances = [a["distance_km"] for a in data["amenities"]]
    assert distances == sorted(distances)

    # Verify lat/lon are returned on every amenity
    for a in data["amenities"]:
        assert isinstance(a["latitude"], float)
        assert isinstance(a["longitude"], float)
        assert a["source"] == "DEMO"


def test_amenities_type_filter(client):
    """Test filtering amenities by specific types (repeatable param)."""
    response = client.get(
        "/api/amenities",
        params={"location": "Rajpura", "type": ["school", "hospital"]},
    )
    assert response.status_code == 200
    data = response.json()
    for a in data["amenities"]:
        assert a["type"] in ("school", "hospital")


def test_amenities_missing_location_returns_400(client):
    """Calling /api/amenities without location or coordinates must return 400."""
    response = client.get("/api/amenities")
    assert response.status_code == 400
    assert "Either 'location' or both 'latitude' and 'longitude'" in response.json()["detail"]


# ==============================================================================
# 7. LOCALITY ENDPOINT: 404 UNKNOWN LOCALITY & 12-MONTH MARKET STATS
# ==============================================================================

def test_locality_happy_path_all(client):
    """Calling /api/locality with no param returns all 6 localities with market stats."""
    response = client.get("/api/locality")
    assert response.status_code == 200
    data = response.json()
    assert data["count"] == 6
    assert data["source_type"] == "demo"
    assert data["disclaimer"] == DISCLAIMER_TEXT

    # Check Rajpura features & stats
    rajpura_item = next(item for item in data["localities"] if item["locality"] == "Rajpura")
    assert rajpura_item["schools_count"] >= 1
    assert rajpura_item["hospitals_count"] >= 1
    assert rajpura_item["pollution_level"] == "moderate"
    assert rajpura_item["market_context"]["transaction_count"] > 0
    assert "independent_house" in rajpura_item["market_context"]["by_property_type"]


def test_locality_unknown_returns_404_with_known_list(client):
    """Calling /api/locality for an unknown locality must return 404 listing known localities."""
    response = client.get("/api/locality", params={"locality": "Chandigarh"})
    assert response.status_code == 404
    detail = response.json()["detail"]
    assert "Chandigarh" in detail["message"]
    assert set(detail["known_localities"]) == VALID_LOCALITIES


# ==============================================================================
# 8. PRICE TREND ENDPOINT: HISTORICAL AVERAGES & SPARSITY
# ==============================================================================

def test_price_trend_happy_path(client):
    """Test price trend returns yearly transaction averages with sparsity indicator."""
    response = client.get(
        "/api/price-trend",
        params={"locality": "Rajpura", "property_type": "independent_house", "years": 4},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["locality"] == "Rajpura"
    assert data["property_type"] == "independent_house"
    assert len(data["trend"]) == 4
    assert data["source_type"] == "demo"
    assert data["disclaimer"] == DISCLAIMER_TEXT

    # Check sparse boolean flag logic
    for yr in data["trend"]:
        assert yr["sparse"] == (yr["transaction_count"] < 3)


def test_price_trend_unknown_locality_returns_404(client):
    """Price trend for unknown locality returns 404."""
    response = client.get("/api/price-trend", params={"locality": "UnknownTown"})
    assert response.status_code == 404


# ==============================================================================
# 9. GENERAL VALIDATION: MISSING PARAMS & NO 500 ON EMPTY RESULTS
# ==============================================================================

def test_comparables_missing_param_returns_422(client):
    """Missing required parameters in /api/comparables returns 422 Unprocessable Entity."""
    response = client.get("/api/comparables")
    assert response.status_code == 422


def test_comparables_invalid_property_type_returns_400(client):
    """Invalid property_type returns 400 with helpful message."""
    response = client.get(
        "/api/comparables",
        params={"location": "Rajpura", "property_type": "penthouse", "area": 1000},
    )
    assert response.status_code == 400
    assert "Invalid property_type" in response.json()["detail"]


def test_no_500_on_empty_result(client):
    """Querying an area window with no matches must NEVER return 500; returns 200 with count 0."""
    response = client.get(
        "/api/comparables",
        params={
            "location": "Sarai Banjara",
            "property_type": "shop",
            "area": 50000,  # Unrealistic size for shop in thin locality
            "radius_km": 1.0,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["count"] == 0
    assert data["comparables"] == []
    assert data["evidence_summary"]["transactions"] == 0
    assert data["evidence_summary"]["listings"] == 0
    assert data["source_type"] == "demo"
    assert data["disclaimer"] == DISCLAIMER_TEXT
