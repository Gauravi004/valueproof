from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from app.schemas.property import PropertyInput
from app.schemas.comparable import ScoredComparable
from app.schemas.location import LocationIntelligenceResponse
from app.schemas.negotiation import NegotiationAnalysisResponse
from app.schemas.renovation import RenovationScenarioResponse


class EvidenceStrengthLevel(str, Enum):
    STRONG = "Strong"
    MODERATE = "Moderate"
    LIMITED = "Limited"
    INSUFFICIENT = "Insufficient"


class ValuationAdjustment(BaseModel):
    category: str = Field(..., description="e.g. 'Road Width', 'Corner Plot', 'Condition', 'Age Depreciation'")
    description: str = Field(..., description="Readable explanation e.g. '+4% Corner plot visibility and dual access'")
    amount_inr: float = Field(..., description="Calculated rupee impact (positive or negative)")
    percentage_impact: float = Field(..., description="Percentage relative to base value")
    is_positive: bool


class ValuationRange(BaseModel):
    low: float = Field(..., description="Conservative lower estimate")
    mid: float = Field(..., description="Representative mid estimate")
    high: float = Field(..., description="Optimistic upper estimate")
    spread_percentage: float = Field(..., description="Percentage spread around mid")
    spread_rationale: str = Field(..., description="Why this dispersion width was established")


class EvidenceStrength(BaseModel):
    score: float = Field(..., ge=0.0, le=100.0, description="Code-calculated score (0-100)")
    label: EvidenceStrengthLevel
    reasons: List[str]


class EvidencePassport(BaseModel):
    sources_summary: List[str]
    total_records_analyzed: int
    records_used_in_valuation: int
    calculation_steps: List[str]
    limitations: List[str]
    evidence_strength: EvidenceStrength
    generated_at: str
    is_synthetic_dataset: bool = True


class ValuationRequest(BaseModel):
    property: PropertyInput
    asking_price: Optional[float] = Field(None, gt=0, description="Optional asking price for instant negotiation analysis")
    include_ai_explanation: bool = Field(True, description="Whether to invoke Gemini or deterministic explanation")


class ValuationResult(BaseModel):
    property_input: PropertyInput
    estimated_value: float
    valuation_range: ValuationRange
    representative_price_per_sqft: float
    base_comparable_value: float
    price_breakdown: List[ValuationAdjustment]
    total_positive_adjustments: float
    total_negative_adjustments: float
    selected_comparables: List[ScoredComparable]
    total_records_analyzed: int
    location_intelligence: LocationIntelligenceResponse
    evidence_passport: EvidencePassport
    negotiation_lens: Optional[NegotiationAnalysisResponse] = None
    renovation_preview: Optional[RenovationScenarioResponse] = None
    ai_explanation: str
    explanation_source: str = Field("deterministic_engine", description="'gemini' or 'deterministic_engine'")
