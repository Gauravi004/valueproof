from typing import Optional
from app.core.logging import logger, generate_request_id
from app.schemas.property import PropertyInput
from app.schemas.valuation import ValuationRequest, ValuationResult
from app.schemas.negotiation import NegotiationAnalysisRequest
from app.schemas.renovation import RenovationScenarioRequest, RenovationScope
from app.comparables.service import comparable_service
from app.valuation.engine import valuation_engine
from app.location.provider import location_provider
from app.evidence.passport import passport_builder
from app.negotiation.lens import negotiation_lens
from app.renovation.calculator import renovation_calculator
from app.explanation.service import explanation_service


class ValuationOrchestrator:
    def valuate(self, request: ValuationRequest) -> ValuationResult:
        req_id = generate_request_id()
        subject = request.property
        asking_price = request.asking_price

        logger.info(
            f"[{req_id}] Initiating valuation for {subject.property_type.value} "
            f"({subject.area_sqft} sqft) in {subject.location.locality}, {subject.location.city}"
        )

        # 1. Retrieve and rank comparables
        all_comps = comparable_service.get_all()
        total_analyzed = len(all_comps)
        scored_comps = comparable_service.find_and_score(subject, max_results=6)

        logger.info(f"[{req_id}] Scored {total_analyzed} records, selected top {len(scored_comps)} matches.")

        # 2. Deterministic Valuation Engine execution
        (
            estimated_value,
            val_range,
            rep_price_sqft,
            base_value,
            adjustments,
            total_pos,
            total_neg
        ) = valuation_engine.evaluate(subject, scored_comps)

        # 3. Location Intelligence
        loc_intel = location_provider.get_location_intelligence(
            city=subject.location.city,
            locality=subject.location.locality,
            lat=subject.location.latitude,
            lon=subject.location.longitude
        )

        # 4. Evidence Passport
        passport = passport_builder.build_passport(
            subject=subject,
            comparables=scored_comps,
            total_analyzed=total_analyzed,
            base_value=base_value,
            rep_price_sqft=rep_price_sqft,
            adjustments=adjustments,
            estimated_value=estimated_value,
            val_range=val_range
        )

        # 5. Negotiation Lens (if asking price is provided)
        negotiation_res = None
        if asking_price is not None and asking_price > 0:
            nego_req = NegotiationAnalysisRequest(
                asking_price=asking_price,
                estimated_mid=val_range.mid,
                range_low=val_range.low,
                range_high=val_range.high,
                property_type=subject.property_type.value,
                locality=subject.location.locality
            )
            negotiation_res = negotiation_lens.analyze(nego_req)

        # 6. Default Renovation Preview
        renovation_preview = None
        if subject.property_type.value != "residential_plot":
            renov_req = RenovationScenarioRequest(
                current_estimated_value=estimated_value,
                area_sqft=subject.area_sqft,
                scope=RenovationScope.FULL_INTERIOR,
                current_condition=subject.condition.value
            )
            renovation_preview = renovation_calculator.simulate(renov_req)

        # 7. AI Explanation Layer
        ai_exp = ""
        exp_source = "deterministic_engine"
        if request.include_ai_explanation:
            exp_payload = {
                "estimated_value": estimated_value,
                "range_low": val_range.low,
                "range_high": val_range.high,
                "representative_price_per_sqft": rep_price_sqft,
                "property_type": subject.property_type.value,
                "locality": subject.location.locality,
                "city": subject.location.city,
                "area_sqft": subject.area_sqft,
                "price_breakdown": [a.model_dump() for a in adjustments],
                "comparables": [c.model_dump() for c in scored_comps],
                "evidence_strength": passport.evidence_strength.model_dump(),
                "limitations": passport.limitations
            }
            ai_exp, exp_source = explanation_service.explain(exp_payload)

        result = ValuationResult(
            property_input=subject,
            estimated_value=estimated_value,
            valuation_range=val_range,
            representative_price_per_sqft=rep_price_sqft,
            base_comparable_value=base_value,
            price_breakdown=adjustments,
            total_positive_adjustments=total_pos,
            total_negative_adjustments=total_neg,
            selected_comparables=scored_comps,
            total_records_analyzed=total_analyzed,
            location_intelligence=loc_intel,
            evidence_passport=passport,
            negotiation_lens=negotiation_res,
            renovation_preview=renovation_preview,
            ai_explanation=ai_exp,
            explanation_source=exp_source
        )

        logger.info(f"[{req_id}] Valuation completed successfully. Result dispatched.")
        return result


valuation_orchestrator = ValuationOrchestrator()
