"""Pydantic v2 schemas and response models for MoolyaSetu Evidence Layer."""

from typing import Dict, List, Optional, Any, Literal, Sequence
from pydantic import BaseModel, Field

DISCLAIMER_TEXT = (
    "Illustrative demo data generated for prototype purposes. "
    "Not sourced from any government registry or transaction record."
)


def derive_source_type(sources: Sequence[str]) -> str:
    """Derive overall source_type from a sequence of record sources.

    - Returns 'demo' if all rows are DEMO (case-insensitive) or sequence is empty.
    - Returns 'registry' if all rows are from official/registry feeds.
    - Returns 'mixed' if rows contain multiple disparate sources.
    """
    if not sources:
        return "demo"
    cleaned = {str(s).strip().upper() for s in sources if s}
    if not cleaned or cleaned == {"DEMO"}:
        return "demo"
    if cleaned.issubset({"REGISTRY", "GOVT", "OFFICIAL", "NGDRS"}):
        return "registry"
    return "mixed"


# --- Comparables Models ---

class ScoreComponents(BaseModel):
    area: float = Field(..., description="Area closeness score in [0.0, 1.0]")
    distance: float = Field(..., description="Geographic proximity score in [0.0, 1.0]")
    recency: float = Field(..., description="Recency score in [0.0, 1.0]")


class ComparableItem(BaseModel):
    id: str
    record_type: Literal["transaction", "listing"]
    date: str
    locality: str
    property_type: str
    area_sqft: float
    price: float
    price_per_sqft: float
    latitude: float
    longitude: float
    distance_km: float
    age_years: Optional[int] = None
    road_width_ft: Optional[int] = None
    similarity_score: float
    score_components: ScoreComponents
    source: str


class ObservedPricePerSqft(BaseModel):
    min: Optional[float] = None
    median: Optional[float] = None
    max: Optional[float] = None


class EvidenceSummary(BaseModel):
    transactions: int
    listings: int
    observed_price_per_sqft: Optional[ObservedPricePerSqft] = None


class ComparablesResponse(BaseModel):
    subject: Dict[str, Any]
    count: int
    source_type: str
    disclaimer: str = DISCLAIMER_TEXT
    relaxations_applied: List[str] = Field(default_factory=list)
    evidence_summary: EvidenceSummary
    comparables: List[ComparableItem]


# --- Amenities Models ---

class AmenityItem(BaseModel):
    name: str
    type: str
    latitude: float
    longitude: float
    distance_km: float
    source: str


class NearestAmenityInfo(BaseModel):
    name: str
    distance_km: float


class ReferencePoint(BaseModel):
    latitude: float
    longitude: float
    location_name: Optional[str] = None


class AmenitiesResponse(BaseModel):
    reference_point: ReferencePoint
    count: int
    source_type: str
    disclaimer: str = DISCLAIMER_TEXT
    counts_by_type: Dict[str, int]
    nearest_by_type: Dict[str, NearestAmenityInfo]
    amenities: List[AmenityItem]


# --- Locality Models ---

class ObservedPropertyTypeStats(BaseModel):
    count: int
    min_price_per_sqft: Optional[float] = None
    median_price_per_sqft: Optional[float] = None
    max_price_per_sqft: Optional[float] = None


class LocalityMarketContext(BaseModel):
    note: str = (
        "Observed market statistics over the last 12 months. "
        "Descriptive statistics only, not an estimate or valuation."
    )
    transaction_count: int
    listing_count: int
    by_property_type: Dict[str, ObservedPropertyTypeStats]


class LocalityItem(BaseModel):
    locality: str
    schools_count: int
    hospitals_count: int
    markets_count: int
    food_places_count: int
    highway_distance_km: float
    railway_distance_km: float
    pollution_level: str
    source: str
    market_context: LocalityMarketContext


class LocalityResponse(BaseModel):
    count: int
    source_type: str
    disclaimer: str = DISCLAIMER_TEXT
    localities: List[LocalityItem]


# --- Trends Models ---

class YearTrendItem(BaseModel):
    year: int
    avg_price_per_sqft: Optional[float] = None
    transaction_count: int
    sparse: bool


class PriceTrendResponse(BaseModel):
    locality: str
    property_type: Optional[str] = None
    source_type: str
    disclaimer: str = DISCLAIMER_TEXT
    note: str = "Observed historical transaction averages. Years with <3 transactions are flagged as sparse."
    trend: List[YearTrendItem]


# --- Data Quality Models ---

class DataQualityResponse(BaseModel):
    location: str
    property_type: str
    area_sqft: float
    comparable_transactions: int
    local_listings: int
    nearby_amenities: int
    total_comparables: int
    quality: Literal["good", "moderate", "limited"]
    quality_reason: str
    source_type: str
    disclaimer: str = DISCLAIMER_TEXT
    thresholds_note: str = (
        "Prototype heuristic: limited < 5, moderate 5-9, good >= 10 total comparables. "
        "Not a calibrated statistical measure."
    )


# --- System / Meta Models ---

class MetaResponse(BaseModel):
    localities: List[str]
    property_types: List[str]
    amenity_types: List[str]
    pollution_levels: List[str]
    date_coverage: Dict[str, str]
    source_type_breakdown: Dict[str, int]
    source_type: str
    disclaimer: str = DISCLAIMER_TEXT


class HealthResponse(BaseModel):
    status: str
    rows: Dict[str, int]
    source_type: str
    disclaimer: str = DISCLAIMER_TEXT
