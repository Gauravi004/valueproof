from typing import List, Optional
from pydantic import BaseModel, Field


class ComparableProperty(BaseModel):
    id: str = Field(..., description="Unique record identifier")
    source: str = Field(..., description="Source name, clearly labeled if demo/synthetic")
    source_type: str = Field("government_registry_mock", description="Source classification")
    date: str = Field(..., description="Date of transaction or listing")
    locality: str
    city: str
    property_type: str
    area_sqft: float
    price: float
    price_per_sqft: float
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    age_years: float = 0.0
    road_width_ft: float = 20.0
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    corner_plot: bool = False
    condition: str = "good"
    is_synthetic: bool = True


class ScoredComparable(BaseModel):
    id: str
    source: str
    source_type: str
    date: str
    locality: str
    city: str
    property_type: str
    area_sqft: float
    price: float
    price_per_sqft: float
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    age_years: float
    road_width_ft: float
    corner_plot: bool
    condition: str
    similarity_score: float = Field(..., ge=0.0, le=100.0, description="Overall match similarity percentage (0-100)")
    distance_km: Optional[float] = Field(None, description="Calculated distance in km if coordinates available")
    selection_reasons: List[str] = Field(default_factory=list, description="Explicit reasons why this comparable was chosen")
    is_synthetic: bool = True


class ComparableQueryResponse(BaseModel):
    total_available: int
    matched_count: int
    comparables: List[ScoredComparable]
    demo_disclaimer: str = "DEMO / SYNTHETIC / ILLUSTRATIVE DATA: Transactions are modeled for illustrative purposes and do not represent verified financial contracts."
