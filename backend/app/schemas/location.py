from typing import List, Optional
from pydantic import BaseModel, Field


class LocationSignal(BaseModel):
    category: str = Field(..., description="e.g. schools, healthcare, transport, markets, retail, pollution")
    title: str = Field(..., description="Human-friendly label e.g. 'Nearby Schools'")
    rating: str = Field(..., description="'Strong', 'High', 'Moderate', 'Limited', 'Elevated'")
    score: float = Field(..., ge=0.0, le=10.0, description="Normalized score out of 10")
    distance_km: Optional[float] = Field(None, description="Proximity distance in km if available")
    detail: str = Field(..., description="Contextual explanation for the user")
    is_direct_price_factor: bool = Field(False, description="True if factor directly modified price, False if contextual")


class LocationIntelligenceResponse(BaseModel):
    city: str
    locality: str
    provider: str = Field("DemoLocationProvider", description="Name of the active location provider")
    is_demo: bool = True
    overall_liveability_score: float = Field(..., ge=0.0, le=100.0)
    signals: List[LocationSignal]
    contextual_summary: str
    direct_valuation_notes: List[str] = Field(default_factory=list)
    limitations: List[str] = Field(default_factory=list)
