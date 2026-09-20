from enum import Enum
from typing import List
from pydantic import BaseModel, Field


class NegotiationPosition(str, Enum):
    ABOVE_RANGE = "above_range"
    WITHIN_RANGE = "within_range"
    BELOW_RANGE = "below_range"


class NegotiationAnalysisRequest(BaseModel):
    asking_price: float = Field(..., gt=0, description="Asking price in Indian Rupees (INR)")
    estimated_mid: float = Field(..., gt=0)
    range_low: float = Field(..., gt=0)
    range_high: float = Field(..., gt=0)
    property_type: str = "property"
    locality: str = ""


class NegotiationAnalysisResponse(BaseModel):
    asking_price: float
    range_low: float
    estimated_mid: float
    range_high: float
    position: NegotiationPosition
    difference_from_mid: float
    difference_from_bound: float
    percent_variance_from_mid: float
    summary: str
    evidence_points: List[str]
    disclaimer: str = (
        "Decision-support only. ValueProof does not provide financial or investment recommendations "
        "and does not issue directives to buy, sell, or reject any transaction."
    )
