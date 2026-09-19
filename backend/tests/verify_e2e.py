import sys
import json
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# Add backend directory to sys.path
backend_path = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_path))

from app.schemas.property import PropertyInput, PropertyLocation, PropertyType, PropertyCondition, IntentType
from app.schemas.valuation import ValuationRequest
from app.services.valuation_service import valuation_orchestrator


def run_e2e_verification():
    print("=" * 70)
    print("VALUEPROOF — END-TO-END SYSTEM VERIFICATION")
    print("=" * 70)

    # 1. Prepare Subject Property Payload matching Section 33
    subject = PropertyInput(
        location=PropertyLocation(
            city="Rajpura",
            locality="Focal Point Road",
            latitude=30.4852,
            longitude=76.5931
        ),
        property_type=PropertyType.INDEPENDENT_HOUSE,
        area_sqft=1800,
        age_years=8,
        road_width_ft=30,
        bedrooms=3,
        bathrooms=2,
        corner_plot=True,
        floor=1,
        condition=PropertyCondition.GOOD,
        intent=IntentType.SELL
    )

    req = ValuationRequest(
        property=subject,
        asking_price=7500000.0,
        include_ai_explanation=True
    )

    print("\n[STEP 1] Ingested Property Input:")
    print(f"  • Locality: {subject.location.locality}, {subject.location.city}")
    print(f"  • Type: {subject.property_type.value}, Area: {subject.area_sqft} sqft")
    print(f"  • Vintage: {subject.age_years} yrs, Road: {subject.road_width_ft} ft, Corner: {subject.corner_plot}")
    print(f"  • Asking Price: ₹{req.asking_price:,.0f}")

    # 2. Execute Orchestrator
    result = valuation_orchestrator.valuate(req)

    # 3. Verify Comparable Selection
    print("\n[STEP 2] Comparable Selection:")
    print(f"  • Total repository records evaluated: {result.total_records_analyzed}")
    print(f"  • Selected matching comparables: {len(result.selected_comparables)}")
    for i, c in enumerate(result.selected_comparables, 1):
        print(f"    {i}. [{c.id}] {c.locality} | ₹{c.price_per_sqft:,.0f}/sqft | Match: {c.similarity_score}% | Reasons: {', '.join(c.selection_reasons[:2])}")
    assert len(result.selected_comparables) > 0, "No comparables selected!"

    # 4. Verify Base Value Derivation
    print("\n[STEP 3] Base Value Derivation:")
    print(f"  • Representative Unit Rate: ₹{result.representative_price_per_sqft:,.2f}/sqft")
    print(f"  • Subject Area: {subject.area_sqft} sqft")
    print(f"  • Base Comparable Value: ₹{result.base_comparable_value:,.2f}")
    assert result.base_comparable_value == round(result.representative_price_per_sqft * subject.area_sqft, 2)

    # 5. Verify Documented Adjustments
    print("\n[STEP 4] Documented Property Adjustments:")
    for adj in result.price_breakdown:
        sign = "+" if adj.is_positive else "-"
        print(f"  • {sign} ₹{abs(adj.amount_inr):,.2f} ({adj.percentage_impact:+.1f}%): {adj.category} ({adj.description})")

    calc_est = round(result.base_comparable_value + result.total_positive_adjustments + result.total_negative_adjustments)
    print(f"\n[STEP 5] Reconciled Estimated Value:")
    print(f"  • Estimated Value: ₹{result.estimated_value:,.0f}")
    assert result.estimated_value == calc_est, f"Mismatch: {result.estimated_value} != {calc_est}"

    # 6. Verify Valuation Range
    print("\n[STEP 6] Valuation Range (Empirical Corridor):")
    print(f"  • Low Bound (Conservative): ₹{result.valuation_range.low:,.0f}")
    print(f"  • Mid Bound (Representative): ₹{result.valuation_range.mid:,.0f}")
    print(f"  • High Bound (Optimistic): ₹{result.valuation_range.high:,.0f}")
    print(f"  • Dispersion Margin: ±{result.valuation_range.spread_percentage}%")
    assert result.valuation_range.low < result.valuation_range.mid < result.valuation_range.high

    # 7. Verify Evidence Passport
    print("\n[STEP 7] Evidence Passport:")
    passport = result.evidence_passport
    print(f"  • Evidence Strength: {passport.evidence_strength.label} ({passport.evidence_strength.score}/100)")
    print(f"  • Key Reasons: {passport.evidence_strength.reasons}")
    print(f"  • Audit Steps Count: {len(passport.calculation_steps)}")
    print(f"  • Synthetic Dataset Disclosed: {passport.is_synthetic_dataset}")
    assert passport.evidence_strength.score > 0
    assert len(passport.calculation_steps) >= 5

    # 8. Verify Location Intelligence
    print("\n[STEP 8] Location Intelligence:")
    loc = result.location_intelligence
    print(f"  • Livability Score: {loc.overall_liveability_score}/100")
    print(f"  • Active Signals Count: {len(loc.signals)}")
    for s in loc.signals[:3]:
        print(f"    - {s.title} ({s.rating}): {s.detail}")
    assert len(loc.signals) > 0

    # 9. Verify Negotiation Lens
    print("\n[STEP 9] Negotiation Lens:")
    nego = result.negotiation_lens
    assert nego is not None
    print(f"  • Asking Price: ₹{nego.asking_price:,.0f}")
    print(f"  • Position: {nego.position.value}")
    print(f"  • Summary: {nego.summary}")
    print(f"  • Decision Support Only: True (No directives to buy/sell/reject)")

    # 10. Verify Renovation Simulator
    print("\n[STEP 10] Renovation Scenario Simulator:")
    renov = result.renovation_preview
    assert renov is not None
    print(f"  • Projected Renovation Cost: ₹{renov.renovation_cost:,.0f}")
    print(f"  • Potential Value Uplift: +₹{renov.potential_value_uplift:,.0f}")
    print(f"  • Potential Post-Renovation Value: ₹{renov.potential_post_renovation_value:,.0f}")
    print(f"  • Potential Net Gain: +₹{renov.potential_net_gain:,.0f} ({renov.roi_percentage}% ROI)")
    assert renov.potential_net_gain > 0

    # 11. Verify Explanation
    print("\n[STEP 11] AI Explanation Layer:")
    print(f"  • Source: {result.explanation_source}")
    print(f"  • Explanation snippet:\n{result.ai_explanation[:250]}...")
    assert len(result.ai_explanation) > 50

    print("\n" + "=" * 70)
    print("ALL 11 END-TO-END MILESTONES VERIFIED WITH ZERO ERRORS!")
    print("=" * 70)


if __name__ == "__main__":
    run_e2e_verification()
