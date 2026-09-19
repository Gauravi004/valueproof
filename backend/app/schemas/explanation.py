from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class ExplainRequest(BaseModel):
    estimated_value: float
    range_low: float
    range_high: float
    representative_price_per_sqft: float
    property_type: str
    locality: str
    city: str
    area_sqft: float
    price_breakdown: List[Dict[str, Any]]
    comparables: List[Dict[str, Any]]
    location_signals: List[Dict[str, Any]]
    evidence_strength: Dict[str, Any]
    limitations: List[str]
    language: str = "en"


class ExplainResponse(BaseModel):
    explanation: str
    source: str = Field("deterministic_engine", description="'gemini' or 'deterministic_engine'")
    language: str = "en"
    key_highlights: List[str] = Field(default_factory=list)
