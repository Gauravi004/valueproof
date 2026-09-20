from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "ValueProof"
    assert data["tagline"] == "Evidence before price."


def test_valuation_endpoint_success():
    payload = {
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
            "corner_plot": True,
            "floor": 1,
            "condition": "good",
            "intent": "sell"
        },
        "asking_price": 7500000,
        "include_ai_explanation": True
    }
    response = client.post("/api/v1/valuate", json=payload)
    assert response.status_code == 200
    data = response.json()

    # Core numbers
    assert data["estimated_value"] > 0
    assert data["base_comparable_value"] > 0
    assert data["representative_price_per_sqft"] > 0
    assert data["valuation_range"]["low"] < data["valuation_range"]["mid"] < data["valuation_range"]["high"]

    # Breakdown exists
    assert len(data["price_breakdown"]) > 0

    # Evidence passport
    assert data["evidence_passport"]["records_used_in_valuation"] > 0
    assert data["evidence_passport"]["evidence_strength"]["score"] > 0
    assert len(data["evidence_passport"]["calculation_steps"]) >= 5

    # Location intelligence
    assert data["location_intelligence"]["overall_liveability_score"] > 0
    assert len(data["location_intelligence"]["signals"]) > 0

    # Negotiation lens
    assert data["negotiation_lens"] is not None
    assert data["negotiation_lens"]["asking_price"] == 7500000

    # Renovation preview
    assert data["renovation_preview"] is not None

    # Explanation
    assert len(data["ai_explanation"]) > 0


def test_valuation_validation_error():
    # Area <= 0 should fail validation
    payload = {
        "property": {
            "location": {
                "city": "Rajpura",
                "locality": "Focal Point Road"
            },
            "property_type": "independent_house",
            "area_sqft": -100,  # Negative area
            "age_years": 5
        }
    }
    response = client.post("/api/v1/valuate", json=payload)
    assert response.status_code == 422
    data = response.json()
    assert data["error"] == "Validation Error"


def test_get_comparables_endpoint():
    response = client.get("/api/v1/comparables?city=Rajpura")
    assert response.status_code == 200
    data = response.json()
    assert data["matched_count"] > 0
    assert "DEMO" in data["demo_disclaimer"]


def test_get_location_signals_endpoint():
    response = client.get("/api/v1/location?city=Rajpura&locality=Focal%20Point")
    assert response.status_code == 200
    data = response.json()
    assert data["city"] == "Rajpura"
    assert len(data["signals"]) > 0


def test_renovation_endpoint():
    payload = {
        "current_estimated_value": 6800000,
        "area_sqft": 1500,
        "scope": "kitchen_and_bath",
        "current_condition": "fair"
    }
    response = client.post("/api/v1/renovation-scenario", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["potential_net_gain"] > 0
    assert "scenario" in data["disclaimer"].lower() or "illustrative" in data["disclaimer"].lower()


def test_negotiation_endpoint():
    payload = {
        "asking_price": 8200000,
        "estimated_mid": 7000000,
        "range_low": 6500000,
        "range_high": 7500000
    }
    response = client.post("/api/v1/negotiate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["position"] == "above_range"
    assert data["difference_from_bound"] == 700000


def test_explain_endpoint():
    payload = {
        "estimated_value": 7200000,
        "range_low": 6800000,
        "range_high": 7600000,
        "representative_price_per_sqft": 4000,
        "property_type": "independent_house",
        "locality": "Focal Point",
        "city": "Rajpura",
        "area_sqft": 1800,
        "price_breakdown": [],
        "comparables": [],
        "location_signals": [],
        "evidence_strength": {"score": 75, "label": "Strong", "reasons": ["Test match"]},
        "limitations": ["Demo dataset"]
    }
    response = client.post("/api/v1/explain", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["explanation"]) > 0


def test_frontend_flat_valuation_payload():
    payload = {
        "intent": "sell",
        "location": "Rajpura, Punjab",
        "localityPincode": "Focal Point Road",
        "propertyType": "house",
        "area": 1500,
        "areaUnit": "sqft",
        "age": "1_5",
        "roadWidth": "30ft",
        "bedrooms": 3,
        "isCornerPlot": True,
        "dealerQuote": 7500000
    }
    response = client.post("/api/v1/valuate", json=payload)
    assert response.status_code == 200
    data = response.json()

    # Verify frontend fields are populated
    assert "estimatedValueMid" in data
    assert data["estimatedValueMid"] > 0
    assert data["estimatedValueMin"] < data["estimatedValueMid"] < data["estimatedValueMax"]
    assert "ratePerSqFt" in data
    assert "comparables" in data
    assert len(data["comparables"]) > 0
    assert "amenities" in data
    assert len(data["amenities"]) > 0
    assert "locationSignals" in data
    assert len(data["locationSignals"]) > 0
    assert "price_breakdown" in data
    assert len(data["price_breakdown"]) > 0
    assert data["propertySummary"]["location"] != ""
    assert data["propertySummary"]["areaSqFt"] == 1500


def test_frontend_renovation_payload():
    payload = {
        "currentValue": 7500000,
        "renovationCost": 300000,
        "renovationType": "kitchen_bath"
    }
    response = client.post("/api/v1/renovation-scenario", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["currentValue"] == 7500000
    assert data["renovationCost"] == 300000
    assert data["potentialValueChange"] > 300000
    assert data["potentialPostRenovationValue"] > 7500000
    assert data["roiPercentage"] > 0
    assert len(data["breakdownFactors"]) > 0

