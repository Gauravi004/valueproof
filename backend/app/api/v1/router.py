from typing import Optional, List
from fastapi import APIRouter, HTTPException, Query, status
from app.core.config import settings
from app.core.logging import logger
from app.schemas.property import PropertyInput
from app.schemas.valuation import ValuationRequest, ValuationResult
from app.schemas.comparable import ComparableProperty, ComparableQueryResponse
from app.schemas.location import LocationIntelligenceResponse
from app.schemas.negotiation import NegotiationAnalysisRequest, NegotiationAnalysisResponse
from app.schemas.renovation import RenovationScenarioRequest, RenovationScenarioResponse
from app.schemas.explanation import ExplainRequest, ExplainResponse
from app.comparables.service import comparable_service
from app.location.provider import location_provider
from app.negotiation.lens import negotiation_lens
from app.renovation.calculator import renovation_calculator
from app.explanation.service import explanation_service
from app.services.valuation_service import valuation_orchestrator

api_router = APIRouter(prefix="/api/v1")


@api_router.get("/health", status_code=status.HTTP_200_OK, tags=["Health"])
def health_check():
    """Health check endpoint confirming API status, version, and active configuration."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "tagline": settings.TAGLINE,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "gemini_enabled": bool(settings.GEMINI_API_KEY),
        "location_provider": settings.LOCATION_PROVIDER
    }


@api_router.post("/valuate", response_model=ValuationResult, status_code=status.HTTP_200_OK, tags=["Valuation"])
def run_valuation(payload: ValuationRequest):
    """
    Core Deterministic Valuation endpoint.
    Ingests subject property, retrieves and scores comparables, calculates deterministic base rate,
    applies documented adjustments, builds Evidence Passport, and attaches optional AI explanation.
    """
    try:
        result = valuation_orchestrator.valuate(payload)
        return result
    except Exception as e:
        logger.error(f"Valuation failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Valuation calculation encountered an unexpected error: {str(e)}"
        )


@api_router.get("/comparables", response_model=ComparableQueryResponse, tags=["Comparables"])
def get_comparables(
    city: Optional[str] = Query(None, description="Filter by city e.g. Rajpura, Mohali, Chandigarh"),
    property_type: Optional[str] = Query(None, description="Filter by property type")
):
    """Retrieve raw or filtered comparable transaction pool with demo data disclaimer."""
    records = comparable_service.get_all(city=city, property_type=property_type)
    # Convert to ScoredComparable format for standardized output
    scored_list = []
    for r in records:
        scored_list.append(
            {
                "id": r.id,
                "source": r.source,
                "source_type": r.source_type,
                "date": r.date,
                "locality": r.locality,
                "city": r.city,
                "property_type": r.property_type,
                "area_sqft": r.area_sqft,
                "price": r.price,
                "price_per_sqft": r.price_per_sqft,
                "latitude": r.latitude,
                "longitude": r.longitude,
                "age_years": r.age_years,
                "road_width_ft": r.road_width_ft,
                "corner_plot": r.corner_plot,
                "condition": r.condition,
                "similarity_score": 100.0,
                "distance_km": None,
                "selection_reasons": ["Direct repository catalog record"],
                "is_synthetic": r.is_synthetic
            }
        )
    return ComparableQueryResponse(
        total_available=len(comparable_service.get_all()),
        matched_count=len(records),
        comparables=scored_list
    )


@api_router.get("/location", response_model=LocationIntelligenceResponse, tags=["Location"])
def get_location_signals(
    city: str = Query(..., description="City name"),
    locality: str = Query(..., description="Locality or sector name"),
    latitude: Optional[float] = Query(None, description="Optional GPS latitude"),
    longitude: Optional[float] = Query(None, description="Optional GPS longitude")
):
    """Retrieve location signals, contextual infrastructure factors, and liveability metrics."""
    return location_provider.get_location_intelligence(
        city=city,
        locality=locality,
        lat=latitude,
        lon=longitude
    )


@api_router.post("/negotiate", response_model=NegotiationAnalysisResponse, tags=["Negotiation"])
def analyze_negotiation(payload: NegotiationAnalysisRequest):
    """
    Negotiation Lens:
    Analyzes an asking price relative to the evidence valuation corridor.
    Provides evidence-backed negotiation arguments without giving directive financial advice.
    """
    return negotiation_lens.analyze(payload)


@api_router.post("/renovation-scenario", response_model=RenovationScenarioResponse, tags=["Renovation"])
def calculate_renovation_scenario(payload: RenovationScenarioRequest):
    """
    Renovation ROI / Scenario Simulator:
    Models projected capital expenditure, potential property value uplift, and net gain
    with explicit non-guaranteed scenario disclosures.
    """
    return renovation_calculator.simulate(payload)


@api_router.post("/explain", response_model=ExplainResponse, tags=["Explanation"])
def explain_valuation(payload: ExplainRequest):
    """
    Natural-language explanation endpoint:
    Explains the valuation payload strictly using supplied evidence via Gemini or deterministic fallback.
    """
    raw_payload = payload.model_dump()
    text, source = explanation_service.explain(raw_payload, language=payload.language)
    return ExplainResponse(
        explanation=text,
        source=source,
        language=payload.language,
        key_highlights=[
            f"Valuation range: ₹{payload.range_low:,.0f} - ₹{payload.range_high:,.0f}",
            f"Benchmark unit rate: ₹{payload.representative_price_per_sqft:,.0f}/sqft",
            f"Evidence confidence: {payload.evidence_strength.get('label', 'Moderate')}"
        ]
    )
