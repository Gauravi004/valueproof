import pytest
from pydantic import ValidationError
from app.schemas.property import PropertyInput, PropertyLocation, PropertyType, PropertyCondition, IntentType
from app.schemas.valuation import ValuationRequest
from app.schemas.negotiation import NegotiationAnalysisRequest, NegotiationPosition
from app.schemas.renovation import RenovationScenarioRequest, RenovationScope
from app.comparables.service import ComparableService, comparable_service
from app.comparables.scorer import ComparableScorer
from app.valuation.engine import DeterministicValuationEngine, valuation_engine
from app.valuation.adjustments import AdjustmentEngine
from app.evidence.passport import EvidencePassportBuilder, passport_builder
from app.negotiation.lens import negotiation_lens
from app.renovation.calculator import renovation_calculator
from app.location.provider import DemoLocationProvider


# ==========================================================
# 1. PROPERTY VALIDATION TESTS
# ==========================================================

def test_valid_property_input():
    prop = PropertyInput(
        location=PropertyLocation(city="Rajpura", locality="Focal Point Road"),
        property_type=PropertyType.INDEPENDENT_HOUSE,
        area_sqft=1800,
        age_years=8,
        road_width_ft=30,
        bedrooms=3,
        bathrooms=2,
        corner_plot=True,
        condition=PropertyCondition.GOOD,
        intent=IntentType.SELL
    )
    assert prop.area_sqft == 1800
    assert prop.corner_plot is True
    assert prop.location.city == "Rajpura"


def test_zero_or_negative_area_rejected():
    with pytest.raises(ValidationError):
        PropertyInput(
            location=PropertyLocation(city="Rajpura", locality="Focal Point"),
            property_type=PropertyType.INDEPENDENT_HOUSE,
            area_sqft=0,  # Invalid
            age_years=5
        )

    with pytest.raises(ValidationError):
        PropertyInput(
            location=PropertyLocation(city="Rajpura", locality="Focal Point"),
            property_type=PropertyType.INDEPENDENT_HOUSE,
            area_sqft=-500,  # Invalid
            age_years=5
        )


def test_negative_age_rejected():
    with pytest.raises(ValidationError):
        PropertyInput(
            location=PropertyLocation(city="Rajpura", locality="Focal Point"),
            property_type=PropertyType.INDEPENDENT_HOUSE,
            area_sqft=1500,
            age_years=-3  # Invalid
        )


def test_empty_location_rejected():
    with pytest.raises(ValidationError):
        PropertyInput(
            location=PropertyLocation(city="   ", locality="Focal Point"),  # Invalid empty
            property_type=PropertyType.INDEPENDENT_HOUSE,
            area_sqft=1500
        )


def test_invalid_property_type_rejected():
    with pytest.raises(ValidationError):
        PropertyInput(
            location=PropertyLocation(city="Rajpura", locality="Focal Point"),
            property_type="spaceship",  # Invalid enum
            area_sqft=1500
        )


# ==========================================================
# 2. COMPARABLE ENGINE TESTS
# ==========================================================

def test_comparable_loading():
    comps = comparable_service.get_all()
    assert len(comps) >= 10
    # Ensure every demo record is marked synthetic
    assert all(c.is_synthetic is True for c in comps)


def test_comparable_scoring_and_ranking():
    subject = PropertyInput(
        location=PropertyLocation(city="Rajpura", locality="Focal Point Road", latitude=30.4852, longitude=76.5931),
        property_type=PropertyType.INDEPENDENT_HOUSE,
        area_sqft=1800,
        age_years=7,
        road_width_ft=30,
        corner_plot=True,
        condition=PropertyCondition.GOOD
    )
    scored = comparable_service.find_and_score(subject, max_results=5)
    assert len(scored) > 0
    # Results should be sorted descending by similarity score
    scores = [c.similarity_score for c in scored]
    assert scores == sorted(scores, reverse=True)
    # Top match in Rajpura should have high similarity
    assert scored[0].similarity_score >= 70.0
    assert len(scored[0].selection_reasons) > 0


# ==========================================================
# 3. VALUATION ENGINE TESTS
# ==========================================================

def test_deterministic_valuation_calculation():
    subject = PropertyInput(
        location=PropertyLocation(city="Rajpura", locality="Focal Point Road"),
        property_type=PropertyType.INDEPENDENT_HOUSE,
        area_sqft=1800,
        age_years=8,
        road_width_ft=30,
        corner_plot=True,
        condition=PropertyCondition.GOOD
    )
    comps = comparable_service.find_and_score(subject, max_results=6)
    (
        estimated_val,
        val_range,
        rep_price_sqft,
        base_value,
        adjustments,
        total_pos,
        total_neg
    ) = valuation_engine.evaluate(subject, comps)

    assert rep_price_sqft > 0
    assert base_value == round(rep_price_sqft * subject.area_sqft, 2)
    # Estimated value must equal base_value + total_pos + total_neg
    assert estimated_val == round(base_value + total_pos + total_neg)
    # Range bounds must strictly satisfy low < mid < high
    assert val_range.low < val_range.mid < val_range.high
    assert val_range.mid == estimated_val


def test_adjustments_corner_and_road_width():
    adj_engine = AdjustmentEngine()
    subject = PropertyInput(
        location=PropertyLocation(city="Rajpura", locality="Focal Point Road"),
        property_type=PropertyType.INDEPENDENT_HOUSE,
        area_sqft=1000,
        age_years=0,
        road_width_ft=35,
        corner_plot=True,
        condition=PropertyCondition.GOOD
    )
    base_val = 5000000.0
    adjs = adj_engine.calculate_adjustments(subject, base_val)

    # Should have corner plot (+4%) and wide road access (+1.5%)
    cats = [a.category for a in adjs]
    assert "Corner Plot Premium" in cats
    assert "Wide Road Access" in cats

    corner_adj = next(a for a in adjs if a.category == "Corner Plot Premium")
    assert corner_adj.amount_inr == 5000000.0 * 0.04


def test_zero_comparables_fallback():
    engine = DeterministicValuationEngine()
    subject = PropertyInput(
        location=PropertyLocation(city="UnknownCity", locality="RemoteLocality"),
        property_type=PropertyType.INDEPENDENT_HOUSE,
        area_sqft=1000
    )
    # Empty comparables list
    estimated_val, val_range, rep_price_sqft, base_value, adjustments, total_pos, total_neg = engine.evaluate(subject, [])
    assert estimated_val > 0
    assert val_range.low < val_range.high


# ==========================================================
# 4. EVIDENCE PASSPORT TESTS
# ==========================================================

def test_evidence_strength_and_passport():
    subject = PropertyInput(
        location=PropertyLocation(city="Rajpura", locality="Focal Point Road"),
        property_type=PropertyType.INDEPENDENT_HOUSE,
        area_sqft=1800,
        age_years=8
    )
    comps = comparable_service.find_and_score(subject, max_results=6)
    strength = passport_builder.calculate_evidence_strength(comps, total_analyzed=20)

    assert 0.0 <= strength.score <= 100.0
    assert strength.label in ["Strong", "Moderate", "Limited", "Insufficient"]
    assert len(strength.reasons) > 0


# ==========================================================
# 5. NEGOTIATION LENS TESTS
# ==========================================================

def test_negotiation_lens_above_range():
    req = NegotiationAnalysisRequest(
        asking_price=8500000,
        estimated_mid=7000000,
        range_low=6500000,
        range_high=7500000,
        property_type="independent_house",
        locality="Focal Point"
    )
    res = negotiation_lens.analyze(req)
    assert res.position == NegotiationPosition.ABOVE_RANGE
    assert res.difference_from_bound == 1000000  # 85L - 75L
    assert "above the current evidence ceiling" in res.summary


def test_negotiation_lens_within_range():
    req = NegotiationAnalysisRequest(
        asking_price=7100000,
        estimated_mid=7000000,
        range_low=6500000,
        range_high=7500000
    )
    res = negotiation_lens.analyze(req)
    assert res.position == NegotiationPosition.WITHIN_RANGE
    assert res.difference_from_bound == 0.0


def test_negotiation_lens_below_range():
    req = NegotiationAnalysisRequest(
        asking_price=6000000,
        estimated_mid=7000000,
        range_low=6500000,
        range_high=7500000
    )
    res = negotiation_lens.analyze(req)
    assert res.position == NegotiationPosition.BELOW_RANGE
    assert res.difference_from_bound == 500000  # 65L - 60L


# ==========================================================
# 6. RENOVATION SCENARIO TESTS
# ==========================================================

def test_renovation_calculator():
    req = RenovationScenarioRequest(
        current_estimated_value=7000000,
        area_sqft=1800,
        scope=RenovationScope.FULL_INTERIOR,
        current_condition="good"
    )
    res = renovation_calculator.simulate(req)
    assert res.renovation_cost > 0
    assert res.potential_value_uplift > res.renovation_cost
    assert res.potential_net_gain == res.potential_value_uplift - res.renovation_cost
    assert res.potential_post_renovation_value == res.current_estimated_value + res.potential_value_uplift
    assert res.roi_percentage > 0
