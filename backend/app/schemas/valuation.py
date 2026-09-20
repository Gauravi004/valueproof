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

    # Frontend compatibility fields
    id: str = "adj"
    labelKey: str = "why_price.factor"
    labelFallback: str = ""
    amount: float = 0.0
    type: str = "positive"  # 'base' | 'positive' | 'negative' | 'total'
    explanation: str = ""
    tag: Optional[str] = None


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


class ComparablePropertyItem(BaseModel):
    id: str
    title: str
    locality: str
    distanceKm: float
    areaSqFt: float
    propertyType: str
    salePrice: float
    ratePerSqFt: float
    registrationDate: str
    source: str
    similarityScore: float
    imageUrl: Optional[str] = None
    keyFeatures: List[str] = Field(default_factory=list)


class AmenityInfoItem(BaseModel):
    name: str
    category: str
    distance: str
    impactScore: str


class CalculationStepItem(BaseModel):
    stepNumber: int
    title: str
    explanation: str
    formula: str
    value: str


class PropertySummaryItem(BaseModel):
    location: str
    propertyType: str
    areaSqFt: float
    areaOriginal: str
    age: str
    roadWidth: str
    isCornerPlot: bool
    bedrooms: int
    intent: str


class ValuationRequest(BaseModel):
    # Backend format
    property: Optional[PropertyInput] = None
    asking_price: Optional[float] = Field(None, gt=0, description="Optional asking price for instant negotiation analysis")
    include_ai_explanation: bool = Field(True, description="Whether to invoke Gemini or deterministic explanation")

    # Frontend flat format
    intent: Optional[str] = "sell"
    location: Optional[str] = None
    localityPincode: Optional[str] = None
    propertyType: Optional[str] = None
    area: Optional[float] = None
    areaUnit: Optional[str] = "sqft"
    age: Optional[str] = "new"
    roadWidth: Optional[str] = "20ft"
    bedrooms: Optional[int] = 3
    isCornerPlot: Optional[bool] = False
    dealerQuote: Optional[float] = None


class ValuationResult(BaseModel):
    # Frontend properties
    id: str = "VP-001"
    intent: str = "sell"
    estimatedValueMin: float = 0.0
    estimatedValueMax: float = 0.0
    estimatedValueMid: float = 0.0
    ratePerSqFt: float = 0.0
    circleRatePerSqFt: float = 0.0
    evidenceStrength: str = "High"
    confidenceScore: float = 90.0
    comparableCount: int = 0
    locationSignals: List[str] = Field(default_factory=list)
    comparables: List[ComparablePropertyItem] = Field(default_factory=list)
    amenities: List[AmenityInfoItem] = Field(default_factory=list)
    calculations: List[CalculationStepItem] = Field(default_factory=list)
    limitations: List[str] = Field(default_factory=list)
    generatedAt: str = ""
    propertySummary: Optional[PropertySummaryItem] = None

    # Backend properties
    property_input: Optional[PropertyInput] = None
    estimated_value: float = 0.0
    valuation_range: Optional[ValuationRange] = None
    representative_price_per_sqft: float = 0.0
    base_comparable_value: float = 0.0
    price_breakdown: List[ValuationAdjustment] = Field(default_factory=list)
    total_positive_adjustments: float = 0.0
    total_negative_adjustments: float = 0.0
    selected_comparables: List[ScoredComparable] = Field(default_factory=list)
    total_records_analyzed: int = 0
    location_intelligence: Optional[LocationIntelligenceResponse] = None
    evidence_passport: Optional[EvidencePassport] = None
    negotiation_lens: Optional[NegotiationAnalysisResponse] = None
    renovation_preview: Optional[RenovationScenarioResponse] = None
    ai_explanation: str = ""
    explanation_source: str = Field("deterministic_engine", description="'gemini' or 'deterministic_engine'")
